module.exports = {
  eleventyComputed: {
    period: data => {
      const start = new Date(data.start_date ?? data.date);
      const end = new Date(data.date ?? 'today');

      // Day is irrelevant
      start.setDate(1);
      end.setDate(1);

      // Format
      const optionsMY = { year: 'numeric', month: 'long' };
      const optionsY = { month: 'long' };

      // Ex. "Monat YYYY"
      if (start - end === 0) {
        return start.toLocaleDateString('de-DE', optionsMY);
      }

      // Ex. "Monat bis Monat YYYY"
      if (start.getFullYear() === end.getFullYear()) {
        return `${start.toLocaleDateString('de-DE', optionsY)} bis ${end.toLocaleDateString('de-DE', optionsMY)}`;
      }

      // Ex. "Monat YYYY bis Monat YYYY"
      return `${start.toLocaleDateString('de-DE', optionsMY)} bis ${end.toLocaleDateString('de-DE', optionsMY)}`;
    },
  },
}