module.exports = (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy({ 'static': '/' });
  eleventyConfig.addPassthroughCopy('assets');

  return {
    dir: {
      includes: '../_includes',
      input: '_content',
      layouts: '../_layouts',
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