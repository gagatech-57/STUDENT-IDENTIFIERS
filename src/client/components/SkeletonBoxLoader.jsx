import React from 'react';

export function SkeletonBoxLoader({ count = 6 }) {
  return (
    <div className="skeleton-cards-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-card-box">
          <div className="skeleton-card-top">
            <div className="skeleton-avatar-circle shimmer"></div>
            <div className="skeleton-meta-group">
              <div className="skeleton-pill shimmer"></div>
              <div className="skeleton-title shimmer"></div>
              <div className="skeleton-subtitle shimmer"></div>
            </div>
          </div>
          <div className="skeleton-details-box">
            <div className="skeleton-line shimmer"></div>
            <div className="skeleton-line shimmer short"></div>
            <div className="skeleton-line shimmer medium"></div>
          </div>
          <div className="skeleton-actions-row">
            <div className="skeleton-btn shimmer"></div>
            <div className="skeleton-btn shimmer"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
