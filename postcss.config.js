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
        if (selector.startsWith('html') || selector.startsWith('body')) {
          return selector; // Skip prefixing html or body if necessary
        }
        return prefixedSelector;
      },
    }),
    tailwindcss(),
    autoprefixer(),
  ],
};
