<script setup>
import TheHeader from "@/components/TheHeader.vue";
import ProductCard from "@/components/ProductCard.vue";
import { useProductStore } from "./stores/productStore";
import { useCartStore } from "./stores/cartStore";
/*
Si no volem accedir a tot l’store, podem extreure un part d’aquesta,
però per assegurar que l’estat es manté reactiu hem de fer servir la funció storeToRefs
*/
//import { storeToRefs } from "pinia";
//const {products} = storeToRefs(useProductStore())

//Si no es neccessita desestructurar i es vol accedir a tota la store, es fa d'aquesta manera
const productStore = useProductStore()
const cartStore = useCartStore();
productStore.fill()

// const addToCart=(count,product)=>{
//   count = parseInt(count)
//
//   /*
//   El patch es per agrupar totes les mutacions que siguin iguals en una.
//   Per exemple, si demanem 20 pinyes.
//
//   Com el patch utilitza el propi cartstore, els items s'afegeixen directament
//   al estat.
//   */
//   cartStore.$patch(state=>{
//     for(let index = 0; index<count; index++){
//       state.items.push(product)
//     }
//   })
//
// }
</script>

<template>
  <div class="container">
    <TheHeader />
    <ul class="sm:flex flex-wrap lg:flex-nowrap gap-5">
      <ProductCard
        v-for="product in productStore.products"
        :key="product.name"
        :product="product"
        @addToCart="cartStore.addItems($event,product)"
      />
    </ul>
  </div>
</template>
