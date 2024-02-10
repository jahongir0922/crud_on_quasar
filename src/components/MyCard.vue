<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card class="my-card q-pa-sm">
      <img src="../assets/images/svg_icon/clipart.png" />
      <q-card-section>
        <div class="text-h6">{{ prop.product.name_uz }}</div>
        <div class="row justify-between q-pt-none">
          <p>Адрес:</p>
          <p>
            {{ prop.product.address }}
          </p>
        </div>
        <div class="row justify-between q-pt-none">
          <p>Число:</p>
          <p>
            {{
              new Date(prop.product.created_date).getDate() +
              "-" +
              String(
                new Date(prop.product.created_date).getMonth() + 1
              ).padStart(2, "0") +
              "-" +
              new Date(prop.product.created_date).getFullYear()
            }}
          </p>
        </div>
        <div class="row justify-between q-pt-none">
          <p>Цена:</p>
          <p>{{ prop.product.cost }}</p>
        </div>
        <div class="row justify-between q-pt-none">
          <p>Категория:</p>
          <p>{{ getProductType(prop.product.product_type_id) }}</p>
        </div>
        <div class="row justify-between q-pt-none">
          <span
            @click="emit('editProduct', prop.product)"
            class="justify_center"
          >
            <img
              class="edit_icon"
              src="../assets/images/svg_icon/edit.svg"
              alt=""
            />
          </span>
          <span @click="emit('deleteProduct', prop.product.id)">
            <img
              class="delete_icon"
              src="../assets/images/svg_icon/delete.svg"
              alt=""
            />
          </span>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
const prop = defineProps(["product", "product_types"]);
const emit = defineEmits(["deleteProduct", "editProduct"]);
function getProductType(product_type_id) {
  // console.log(product_type_id);
  let res = "";
  prop.product_types.forEach((item) => {
    if (item.id == product_type_id) {
      console.log(item.name_uz);
      // return item.name_uz;
      res = item.name_uz;
    }
  });
  return res;
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 250px
</style>
