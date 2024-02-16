<template>
  <div id="home">
    <div class="container">
      <MyHeader />
    </div>
    <div class="q-pa-md container" id="section1">
      <div class="q-pa-md">
        <q-table
          title="Products"
          :rows="products"
          row-key="name"
          :filter="filter"
          grid
          hide-header
        >
          <template v-slot:top-right>
            <q-input
              borderless
              dense
              debounce="300"
              v-model="filter"
              placeholder="Search"
            >
              <template v-slot:append>
                <q-icon name="search" />
                <span
                  @click="addProduct()"
                  title="Add product"
                  class="icon_add"
                >
                  <img src="../assets/images/svg_icon/add.svg" alt="" />
                </span>
              </template>
            </q-input>
          </template>

          <template v-slot:item="props">
            <div
              class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
            >
              <MyCard
                :product="props"
                :product_types="product_types"
                @edit-product="
                  (product) => {
                    editProduct(product);
                  }
                "
                @delete-product="
                  (product_id) => {
                    deleteProduct(product_id);
                  }
                "
              />
            </div>
          </template>
        </q-table>
      </div>
    </div>
    <div class="loudspeak container">
      <img src="../assets/images/svg_icon/loudspeaker.svg" alt="" />
      <p>
        Все блоки проходятся строго по порядку. Пропустить какой-то блок или
        начать обучение с середины нельзя, даже если вы считаете, что уже знаете
        какую-то часть материала. Только так мы можем гарантировать, что вы
        получите все знания, предусмотренные учебной программой.
      </p>
      <RouterLink to="/sign_up" class="start_test_btn"
        >Начать обучение<span class="material-symbols-outlined">
          north_east
        </span></RouterLink
      >
    </div>
    <MyFooter />
  </div>
</template>
<script setup>
import MyHeader from "../components/MyHeader.vue";
import MyFooter from "../components/MyFooter.vue";
import MyCard from "../components/MyCard.vue";
import { ref } from "vue";
import { api } from "../boot/axios.js";
import { useQuasar } from "quasar";
import MyModal from "src/components/MyModal.vue";
const $q = useQuasar();
const products = ref([]);
const product_types = ref([]);
const filter = ref("");
function get_products() {
  products.value = [];
  api
    .get(`/product/`)
    .then((res) => {
      products.value = res.data;
    })
    .catch((err) => {
      console.log(err.message);
      products.value = res.data;
    });
}
function addProduct() {
  $q.dialog({
    component: MyModal,
    componentProps: {
      prop_product_types: product_types.value,
    },
  })
    .onOk((value) => {
      console.log(value);
      api
        .post("/product/", {
          name_uz: value[0],
          address: value[1],
          cost: value[2],
          product_type_id: value[3],
          created_date: new Date(),
        })
        .then((res) => {
          get_products();
          $q.dialog({
            title: "Добавлен",
            message: `Продукт добавлен.`,
          });
        })
        .catch((err) => {
          console.log(err.message);
          $q.dialog({
            title: "Нет соединения с интернетом",
            message: `Пожалуйста, попробуйте еще раз.`,
          });
        });
    })
    .onCancel(() => {})
    .onDismiss(() => {});
}
function editProduct(product) {
  $q.dialog({
    component: MyModal,
    componentProps: {
      prop_name: product.name_uz,
      prop_cost: product.cost,
      prop_address: product.address,
      type_id: product.product_type_id,
      prop_product_types: product_types.value,
    },
  })
    .onOk((value) => {
      api
        .put("/product/", {
          id: product.id,
          name_uz: value[0],
          address: value[1],
          cost: value[2],
          product_type_id: value[3],
          created_date: new Date(),
        })
        .then((res) => {
          get_products();
          $q.dialog({
            title: "Добавлен",
            message: `Продукт добавлен.`,
          });
        })
        .catch((err) => {
          console.log(err.message);
          $q.dialog({
            title: "Нет соединения с интернетом",
            message: `Пожалуйста, попробуйте еще раз.`,
          });
        });
    })
    .onCancel(() => {})
    .onDismiss(() => {});
}
function deleteProduct(product_id) {
  $q.dialog({
    title: "Вы уверены?",
    message: "Вы не сможете это вернуть!",
    cancel: true,
  }).onOk(() => {
    api
      .delete(`/product/${product_id}`)
      .then((res) => {
        let seconds = 1;
        const dialog = $q.dialog({
          title: "Удален",
          message: `Ваш файл был удален!`,
          ok: false,
        });
        const timer = setInterval(() => {
          seconds--;
          if (seconds > 0) {
            dialog.update({
              message: `Autoclosing in ${seconds} second${
                seconds > 1 ? "s" : ""
              }.`,
            });
          } else {
            clearInterval(timer);
            dialog.hide();
          }
        }, 1000);
        get_products();
      })
      .catch((err) => {
        $q.dialog({
          title: "Упс...",
          message: "Что-то пошло не так!",
        });
      });
  });
}
function get_product_types() {
  api
    .get("/product/get-product-types")
    .then((res) => {
      product_types.value = [...res.data];
    })
    .catch((err) => {
      console.log(err.message);
    });
}
get_product_types();
get_products();
</script>
<style scoped lang="scss"></style>
