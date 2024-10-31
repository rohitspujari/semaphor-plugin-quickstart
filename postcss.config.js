// export default {
//   plugins: {
//     tailwindcss: {},
//     autoprefixer: {},
//   },
// };

import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import postcssPrefixSelector from 'postcss-prefix-selector';

export default {
  plugins: [
    postcssPrefixSelector({
      prefix: '.semaphor-custom',
      transform(prefix, selector, prefixedSelector) {
        if (
          // selector.startsWith('html') ||
          selector.startsWith('.dark') ||
          selector.startsWith(':root')
        ) {
          return selector; // Skip prefixing for html and dark and :root
        }

        return prefixedSelector;
      },
    }),
    tailwindcss(),
    autoprefixer(),
  ],
};
