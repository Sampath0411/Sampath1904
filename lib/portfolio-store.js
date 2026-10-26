function requireProductionStore(client, production) {
  if (!client && production) {
    throw new Error("Supabase is required for production writes; configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }
}

const localRateLimits = new Map();

export function createPortfolioStore({ client = null, local, production = false }) {
  if (!local) throw new Error("A local content adapter is required.");

  return {
    async getSite() {
      if (!client) return local.read("site");
      const rows = await client.request("portfolio_site?id=eq.site&select=content");
      return rows?.[0]?.content ?? local.read("site");
    },

    async saveSite(site) {
      requireProductionStore(client, production);
      if (!client) return local.write("site", site);
      await client.request("portfolio_site?id=eq.site", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ content: site }),
      });
    },

    async getProjects({ publishedOnly = false } = {}) {
      if (!client) {
        const projects = local.read("projects");
        return publishedOnly ? projects.filter((project) => project?.published !== false) : projects;
      }
      const rows = await client.request("portfolio_projects?select=document,published,updated_at&order=position.asc");
      const projects = (rows || []).map((row) => ({
        ...row.document,
        published: row.published !== false,
        updatedAt: row.updated_at || row.document?.updatedAt,
      }));
      return publishedOnly ? projects.filter((project) => project.published !== false) : projects;
    },

    async saveProjects(projects) {
      requireProductionStore(client, production);
      if (!client) return local.write("projects", projects);
      await client.request("rpc/replace_portfolio_projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects_payload: projects }),
      });
    },

    async getMessages() {
      if (!client) {
        try { return local.read("messages"); } catch { return []; }
      }
      const rows = await client.request("portfolio_messages?select=id,name,email,message,received_at&order=received_at.desc");
      return (rows || []).map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        message: row.message,
        receivedAt: row.received_at,
      }));
    },

    async addMessage(message) {
      requireProductionStore(client, production);
      if (!client) {
        const messages = await this.getMessages();
        local.write("messages", [message, ...messages].slice(0, 500));
        return;
      }
      await client.request("rpc/store_portfolio_message", {
        method: "POST",
        headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ message_payload: {
          id: message.id,
          name: message.name,
          email: message.email,
          message: message.message,
          received_at: message.receivedAt,
        } }),
      });
    },

    async deleteMessage(id) {
      requireProductionStore(client, production);
      if (!client) {
        const messages = await this.getMessages();
        const remaining = messages.filter((message) => message.id !== id);
        if (remaining.length === messages.length) return false;
        local.write("messages", remaining);
        return true;
      }
      const deleted = await client.request(`portfolio_messages?id=eq.${encodeURIComponent(id)}&select=id`, {
        method: "DELETE",
        headers: { Prefer: "return=representation" },
      });
      return Array.isArray(deleted) && deleted.length > 0;
    },

    async consumeContactLimit(ipHash, maxRequests = 5, windowSeconds = 3600) {
      requireProductionStore(client, production);
      if (client) {
        return client.request("rpc/consume_portfolio_contact_limit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ supplied_hash: ipHash, max_requests: maxRequests, window_seconds: windowSeconds }),
        });
      }
      const now = Date.now();
      const current = localRateLimits.get(ipHash);
      if (!current || now - current.windowStartedAt >= windowSeconds * 1000) {
        localRateLimits.set(ipHash, { windowStartedAt: now, count: 1 });
        return true;
      }
      current.count += 1;
      return current.count <= maxRequests;
    },
  };
}
