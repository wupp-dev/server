import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
// @ts-expect-error
import AppCard from "../../shared/servicios/AppCard.vue";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("AppCard", AppCard);
  },
} satisfies Theme;
