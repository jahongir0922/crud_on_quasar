<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin q-gutter-md">
      <h6>Добавить продукт</h6>
      <q-input
        :autofocus="true"
        v-model="name"
        class="q-pa-sm"
        input-class="no-border q-pa-sm"
        label="Название"
      />
      <q-input
        v-model="address"
        class="q-pa-sm"
        input-class="no-border q-pa-sm"
        label="Адрес"
      />
      <q-input
        v-model="cost"
        type="number"
        class="q-pa-sm"
        input-class="no-border q-pa-sm"
        label="Цена"
      />
      <q-select
        v-model="product_type"
        :options="listOptions"
        :selected-item="(selected = true)"
        label="Категория"
        transition-show="scale"
        transition-hide="scale"
      />
      <q-card-actions align="right">
        <q-btn color="primary" label="OK" @click="onOKClick" />
        <q-btn color="primary" label="Cancel" @click="onDialogCancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from "quasar";
import { ref } from "vue";
const name = ref("");
const address = ref("");
const cost = ref("");
const product_type = ref("");
const props = defineProps([
  "prop_name",
  "prop_address",
  "prop_cost",
  "type_id",
  "prop_product_types",
]);
name.value = props.prop_name;
address.value = props.prop_address;
cost.value = props.prop_cost;
const listOptions = [];
props.prop_product_types.forEach((item) => {
  if (props.type_id && props.type_id == item.id) {
    product_type.value = {
      label: item.name_uz,
      value: item.id,
      selected: true,
    };
  }
  listOptions.push({
    label: item.name_uz,
    value: item.id,
    selected: false,
  });
});
defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
// dialogRef      - Vue ref to be applied to QDialog
// onDialogHide   - Function to be used as handler for @hide on QDialog
// onDialogOK     - Function to call to settle dialog with "ok" outcome
//                    example: onDialogOK() - no payload
//                    example: onDialogOK({ /*...*/ }) - with payload
// onDialogCancel - Function to call to settle dialog with "cancel" outcome

// this is part of our example (so not required)
function onOKClick() {
  // on OK, it is REQUIRED to
  // call onDialogOK (with optional payload)
  onDialogOK([name.value, address.value, cost.value, product_type.value.value]);
  // or with payload: onDialogOK({ ... })
  // ...and it will also hide the dialog automatically
}
</script>
