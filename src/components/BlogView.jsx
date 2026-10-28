import React from 'react';
import { findPostBySlug, renderBlogIndexHtml, renderBlogPostHtml } from '../data/blogPosts';

/**
 * Blog index (/blog/) and posts (/blog/<slug>/).
 * Markup comes from the same renderer scripts/prerender.mjs uses, so the
 * static HTML crawlers read matches what visitors see.
 */
export default function BlogView({ slug }) {
  const post = slug ? findPostBySlug(slug) : null;
  const html = post ? renderBlogPostHtml(post) : renderBlogIndexHtml();

  return (
    <section className="seo-page-intro blog-view">
      <div className="section-container" dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  );
}
