<script setup>
import TheHeader from "@/components/TheHeader.vue";
import ProductCard from "@/components/ProductCard.vue";
import { useProductStore } from "./stores/productStore";
import { useCartStore } from "./stores/cartStore";
import {reactive, ref} from "vue";
/*
Si no volem accedir a tot l’store, podem extreure un part d’aquesta,
però per assegurar que l’estat es manté reactiu hem de fer servir la funció storeToRefs
*/
//import { storeToRefs } from "pinia";
//const {products} = storeToRefs(useProductStore())

//Si no es neccessita desestructurar i es vol accedir a tota la store, es fa d'aquesta manera
const productStore=useProductStore();
const cartStore=useCartStore();
const history=reactive([])
const future=reactive([])
const doingHistory=ref(false)

history.push(JSON.stringify(cartStore.$state));
cartStore.$subscribe((mutation,state)=>{
  if(!doingHistory.value){
    history.push(JSON.stringify(state));
    future.splice(0,future.length)
  }

})

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


//rebrà una callback function que rebrà unes opcions
//name: nom de l'acció
//store instace en el nostre cas cartStore
//args : arguments passats a l'action que son count i product
//també afegim un after hook que permet executar qualsevol
//Cosa després que l'acció retorni i resolgui,
//onError hook per saber quan passa una excepció o falla i fer nosaltres alguna acció
cartStore.$onAction(({
                       name,
                       store,
                       args,
                       after,
                       onError
                     })=>{
  if(name==='addItems'){
    after(()=>{
      console.log(args[0])
    });
    onError((error)=>{
      console.log("Hello error:",error.message);
    });
  }
})

cartStore.$subscribe((mutation,state)=>{
  console.log({mutation})
  console.log({state})
})
const undo= ()=>{
  if (history.length===1) return
  doingHistory.value=true
  history.pop()
  cartStore.$state=JSON.parse(history.at(-1))
  doingHistory.value=false
}
const redo=()=>{
  const latestState=future.pop()
  if(!latestState)return;
  doingHistory.value=true;
  history.push(latestState)
  cartStore.$state=JSON.parse(latestState)
  doingHistory.value=false;
}


</script>

<template>
  <div class="container">
    <TheHeader />
    <div class="mb-5 flex justify-end">
      <AppButton @click="undo">Undo</AppButton>
      <AppButton class="ml-2" @click="redo">Redo</AppButton>
    </div>
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
