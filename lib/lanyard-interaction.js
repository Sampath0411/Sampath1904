export function clampDragPoint(clientX, clientY, rect, cardWidth, cardHeight) {
  const halfWidth = Math.max(0, Math.min(cardWidth / 2, rect.width / 2));
  const halfHeight = Math.max(0, Math.min(cardHeight / 2, rect.height / 2));
  const minX = rect.left + halfWidth;
  const maxX = rect.right ?? rect.left + rect.width;
  const minY = rect.top + halfHeight;
  const maxY = rect.bottom ?? rect.top + rect.height;
  return {
    x: Math.min(maxX - halfWidth, Math.max(minX, clientX)),
    y: Math.min(maxY - halfHeight, Math.max(minY, clientY))
  };
}

export function clampCardAxis(position, limit) {
  const boundary = Math.max(0, limit);
  return Math.min(boundary, Math.max(-boundary, position));
}

export function getCardDragLimit(viewWidth, cardWidth) {
  return Math.max(0, viewWidth / 2 - cardWidth * 0.6);
}
