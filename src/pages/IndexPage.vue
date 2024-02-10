<!-- <template>
  <h1>salom quasar</h1>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "IndexPage",
});
</script> -->
<template>
  <div id="home">
    <div class="container">
      <MyHeader />
    </div>
    <div class="container" id="section1">
      <div class="justify_between">
        <h1>Продукты</h1>
        <span @click="addProduct()" title="Add product" class="icon_add">
          <img src="../assets/images/svg_icon/add.svg" alt="" />
        </span>
      </div>
      <TransitionGroup
        class="cards"
        name="list"
        tag="div"
        appear=""
        @before-enter="beforeEnter"
        @enter="enter"
      >
        <MyCard
          v-for="(product, index) in products"
          :key="index"
          :product="product"
          :product_types="product_types"
          :data-index="index"
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
      /></TransitionGroup>
      <q-pagination
        class="paginate"
        v-model="currentPage"
        :max="5"
        direction-links
        boundary-links
        icon-first="skip_previous"
        icon-last="skip_next"
        icon-prev="fast_rewind"
        icon-next="fast_forward"
        @click="onClickHandler"
      ></q-pagination>
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
import { gsap } from "gsap";
import { api } from "../boot/axios.js";
import { useQuasar } from "quasar";
import MyModal from "src/components/MyModal.vue";
const $q = useQuasar();
const preloader = ref(false);
const products = ref([]);
const product_types = ref([]);
////pagination
const onClickHandler = (page) => {
  get_products();
};
const totalItems = ref(100);
const currentPage = ref(1);
const perPage = ref(12);
////end pagination
///transition
const beforeEnter = (el) => {
  el.style.opacity = 0;
  el.style.transform = "translateY(100px)";
};
const enter = (el, done) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.1,
    onComplete: done,
    delay: el.dataset.index * 0.2,
  });
};
///end transition
function get_products() {
  preloader.value = true;
  products.value = [];
  api
    .get(`/product/?page=${currentPage.value}&perPage=${perPage.value}`)
    .then((res) => {
      preloader.value = false;
      products.value = res.data;
      if (
        res.data.length == perPage.value &&
        perPage.value * currentPage.value == totalItems.value
      ) {
        totalItems.value += perPage.value;
      }
    })
    .catch((err) => {
      preloader.value = false;
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
  console.log(product);
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
      console.log(value);
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
  // for (let i = 0; i < products.value.length; i++) {
  //   api.delete(`/product/${products.value[i].id}`);
  // }
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
  preloader.value = true;
  api
    .get("/product/get-product-types")
    .then((res) => {
      preloader.value = false;
      product_types.value = [...res.data];
    })
    .catch((err) => {
      preloader.value = false;
      console.log(err.message);
    });
}
get_product_types();
get_products();
</script>
<style scoped lang="scss"></style>
