import { watch } from 'vue';
import { KeyboardService } from '@violentmonkey/shortcut';
import { store } from './util';
import {
  handleSearchActive,
  handleSearchClose,
  handleSearchEnter,
  handleSearchOpen,
} from './util/actions';

const KEY_SEARCHBOX = 'searchBox';

const keyboard = new KeyboardService();
keyboard.enable();
const conditionSearchBox = {
  condition: KEY_SEARCHBOX,
};

keyboard.register(
  'ctrlcmd-k',
  () => {
    handleSearchOpen();
  },
  {
    condition: `!${KEY_SEARCHBOX}`,
  },
);
keyboard.register(
  'up',
  () => {
    handleSearchActive((active) => active - 1);
  },
  conditionSearchBox,
);
keyboard.register(
  'down',
  () => {
    handleSearchActive((active) => active + 1);
  },
  conditionSearchBox,
);
keyboard.register(
  'esc',
  () => {
    handleSearchClose();
  },
  conditionSearchBox,
);
keyboard.register(
  'enter',
  () => {
    handleSearchEnter();
  },
  conditionSearchBox,
);

watch(
  () => store.search,
  (search) => {
    keyboard.setContext(KEY_SEARCHBOX, !!search);
  },
  { immediate: true },
);
