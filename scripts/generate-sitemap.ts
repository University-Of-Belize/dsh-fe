// Credit: https://alex-schnabl.medium.com/automatically-generate-sitemap-xml-in-sveltekit-910bd09d17e7
// Thanks, Alex!

import dirTree from 'directory-tree';
import * as fs from "fs";

const baseRoute = "/";
const routes: string[] = [baseRoute]
const date = new Date().toISOString().split('T')[0]

function getSitemapXML(domain: string, routes: string[]) {
    let sitemap = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
    sitemap += "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n"
    routes.forEach(route => {
        sitemap += getSitemapUrl(domain + route)
    })
    sitemap += "\n</urlset>"
    return sitemap;
}

function getSitemapUrl(location: string) {
    const url =
        "<url>\n" +
        `<loc>${location}</loc>\n` +
        `<lastmod>${date}</lastmod>\n` +
        "</url>";
    return url
}

function getEndpoints(tree: dirTree.DirectoryTree, route: string) {
    tree.children!.forEach(child => {
        if (child.children != undefined && child.children.length != 0) {
            let childRoute = route + child.name;
            if (child.children.some(e => e.name === '+page.svelte')) {
                routes.push(childRoute)
            }
            getEndpoints(child, childRoute + "/");
        }
    })
}

const tree = dirTree("./src/routes")

getEndpoints(tree, baseRoute);

// YOUR_DOMAIN should be like https://example.com
const sitemap = getSitemapXML("https://ubcafe.fly.dev", routes)

// If you use the script in postbuild mode use
// For vercel deployment use:
//fs.writeFileSync('.vercel/output/static/sitemap.xml', sitemap);
// fs.writeFileSync('.svelte-kit/output/client/sitemap.xml', sitemap);

// If you use the script in prebuild mode use
fs.writeFileSync('static/sitemap.xml', sitemap);