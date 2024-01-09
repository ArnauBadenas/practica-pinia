import { defineStore } from "pinia";
import {groupBy} from "lodash";
export const useCartStore=defineStore("CartStore",{
    state:()=>{
        return{
            items:[],
        }
    },
    actions:{
        addItems(count,item){
            count=parseInt(count);
            for (let index=0;index<count;index++){
                //En lloc de passar el item per referencia (si canvia un canvien tots)
                //this.items.push(item)
                //El podem passar per valor
                this.items.push({...item})
            }
        },
    },
    getters:{
        //Conta de número de items
        count:(state)=>state.items.length,
        //Comprovació de si un altre getter es 0
        isEmpty:(state)=>state.items.count===0,
        //Agrupar per nom
        grouped:state=>groupBy(state.items,item=>item.name),
    }
});