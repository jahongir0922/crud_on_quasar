import { boot } from "quasar/wrappers";
import VueAwesomePaginate from "vue-awesome-paginate";
import "vue-awesome-paginate/dist/style.css"; // If there is a separate CSS file
export default boot(({ app }) => {
  // app.component("pagination", VueAwesomePaginate);
  app.config.globalProperties.VueAwesomePaginate = VueAwesomePaginate;
});

// export { api };
