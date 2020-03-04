const nunjucks = require('nunjucks');

module.exports = {
  // Takes a ramlObj and outputs the Markdown
  processRamlObj(ramlObj, config) {
    const env = nunjucks.configure(__dirname, { autoescape: false });

    env.addFilter('toJSON', function (value) {
      return nunjucks.runtime.markSafe(JSON.parse(value));
    });

    env.addFilter('json', function (value) {
      const jsonString = JSON.stringify(value, null, 2);
      return nunjucks.runtime.markSafe(jsonString);
    });

    return new Promise((resolve) => {
      const result = env.render('index.nunjucks', ramlObj);
      if (config.processOutput) {
        resolve(config.processOutput(result));
      }

      return resolve(result);
    });
  },

  // Takes the Markdown and post processes it further
  postProcessHtml(data) {
    return data.replace(/\n{3,}/g, '\n\n');
  },
}
