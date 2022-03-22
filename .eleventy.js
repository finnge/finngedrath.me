const path = require("path");

const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItAttrs = require('markdown-it-attrs');
const yaml = require("js-yaml");
const elNavigation = require('@11ty/eleventy-navigation');
const elImage = require('@11ty/eleventy-img');

module.exports = (eleventyConfig) => {

  // Navigation
  eleventyConfig.addPlugin(elNavigation);

  // Markdown
  const options = {
    html: true,
    breaks: true,
    linkify: true
  };
  eleventyConfig.setLibrary('md', markdownIt(options)
    .use(markdownItAnchor)
    .use(markdownItAttrs)
  );

  // Images
  // @see https://dev.to/22mahmoud/how-to-optimize-and-lazyload-images-on-eleventy-11ty-206h
  // eleventyConfig.addPassthroughCopy("_content/**/*.(jp?(e)g|png|webp|tiff|avif|svg)");

  eleventyConfig.addNunjucksAsyncShortcode("Image", async function (src, alt, aspectRatio = "", position = "", _sizes = "", cssClass = "") {
    if (!alt) {
      throw new Error(`Missing \`alt\` on myImage from: ${src}`);
    }

    let sizes = '';
    if (_sizes === "") {
      sizes = "(min-width: 1024px) 1024px, 100vw";
    }

    const inputPath = this.page.inputPath;
    const url = this.page.url;

    let stats = await elImage(`${path.dirname(inputPath)}/${src}`, {
      widths: [25, 320, 640, 960, 1200, 1800, 2400],
      formats: ["jpeg", "webp", "avif"],
      urlPath: `/media`,
      outputDir: `./dist/media`,
      hashLength: 32,
      filenameFormat: function (id, src, width, format) {
        // const extension = path.extname(src);
        // const basename = path.basename(src, extension);

        return `${id}-${width}w.${format}`;
      }
    });

    const lowestSrc = stats["jpeg"][0];


    // TODO: no reduce
    const srcset = Object.keys(stats).reduce(
      (acc, format) => ({
        ...acc,
        [format]: stats[format].reduce(
          (_acc, curr) => `${_acc} ${curr.srcset},`,
          ""
        ),
      }),
      {}
    );

    const sourceAvif = `<source type="image/avif" srcset="${srcset["avif"]}" >`;
    const sourceWebp = `<source type="image/webp" srcset="${srcset["webp"]}" >`;

    const img = `<img
      loading="lazy"
      alt="${alt}"
      src="${lowestSrc.url}"
      sizes="${sizes}"
      srcset="${srcset["jpeg"]}"
      width="${lowestSrc.width}"
      height="${lowestSrc.height}"
      class="${cssClass}"
      style="object-position: ${(position) ? position : '50%, 50%'}${(aspectRatio) ? '; --aspect-ratio:' + aspectRatio : ''}">`;

    const picture = `<picture> ${sourceAvif} ${sourceWebp} ${img} </picture>`;

    return `<figure>${picture}</figure>`
  });


  // Grid
  eleventyConfig.addPairedNunjucksAsyncShortcode("Grid", async function (content) {
    return `<div class="grid"> ${content} </div>`;
  });


  // Data
  eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));

  // Render
  eleventyConfig.addPassthroughCopy({ 'static': '/' });
  eleventyConfig.addPassthroughCopy('assets');

  return {
    dir: {
      includes: '../_includes',
      input: '_content',
      layouts: '../_layouts',
      data: '../_data',
      output: 'dist',
    },
    pathPrefix: '',
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    templateFormats: [
      'md',
      'html',
      'njk',
    ],
  };
};