import { defineStore , acceptHMRUpdate} from "pinia";
import {groupBy, sortBy} from "lodash";
import {useAuthUserStore} from "./AuthUserStore";
import {useLocalStorage} from "@vueuse/core"

export const useCartStore=defineStore("CartStore",{
    historyEnabled: true,
    state:()=>{
        return{
            items:useLocalStorage("CartStore:items",[]),
        }
    },
    actions:{
        addItems(count,item){
            //throw new Error("example error");
            count=parseInt(count);
            for (let index=0;index<count;index++){
                //En lloc de passar el item per referencia (si canvia un canvien tots)
                //this.items.push(item)
                //El podem passar per valor
                this.items.push({...item})
            }
        },
        //Treure un item en concret
        clearItem(name){
            this.items = this.items.filter(item => item.name !== name)
        },
        //Actualitzar el count del item
        setItemCount(item,count){
            this.clearItem(item.name)
            this.addItems(count,item)
        },
        checkout(){
            const authUserStore=useAuthUserStore();
            alert(`${authUserStore.username} name just bought ${this.count} items at a total of $${this.countTotalPrice}`)
        },

    },
    getters:{
        //Conta de número de items
        count:(state)=>state.items.length,
        //Comprovació de si un altre getter es 0
        isEmpty:(state)=> (state.count === 0),
        //Agrupar per nom
        //TODO añadir orderby
        grouped:state=> {
            //Agrupar els items per nom
            const grouped = groupBy(state.items,item=>item.name)
            //Aplanar l'array (si hi ha un array d'arrays, treu-ho fora perque nomes sigui un array)
            const allItems = Object.values(grouped).flat()
            //Ordenar els items per nom
            const sortedItems = sortBy(allItems,'name')
            //Tornar a agrupar els items, ja que en el procés de flat i sort ha canviat l'array.
            return groupBy(sortedItems, item => item.name)
        },


        //Contar items agrupats
        groupCount: (state)=>(name)=>state.grouped[name].length,
        //Calcular el preu total de forma dinamica
        countTotalPrice:state=>state.items.reduce((acc, curr) => acc + curr.price, 0),
    }
});

if(import.meta.hot){
    import.meta.hot.accept(acceptHMRUpdate(useCartStore,import.meta.hot));
}

