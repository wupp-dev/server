import DefaultTheme from "vitepress/theme";
import AppCard from "../../shared/servicios/AppCard.vue";

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component("AppCard", AppCard);
  },
};
