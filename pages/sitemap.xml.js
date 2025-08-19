function generateSiteMap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://www.donnysmith.com</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>1.0</priority>
      </url>
      <url>
        <loc>https://www.donnysmith.com/hire-product-designer</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>https://www.donnysmith.com/ux-designer-fortune-500</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>https://www.donnysmith.com/app-redesign-specialist</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>https://www.donnysmith.com/conversion-rate-optimization-designer</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>0.9</priority>
      </url>
    </urlset>
  `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  // We generate the XML sitemap with the data
  const sitemap = generateSiteMap();

  res.setHeader('Content-Type', 'text/xml');
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;