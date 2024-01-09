import { defineStore } from 'pinia'

export const useProductStore=defineStore("ProductStore", {
    state: () =>{
        return{
            //-------- Aqui s'afegeix el estat per defecte --------//

            //forma curta de importar (si el recurs i les dades tenen el mateix nom)
            //products,

            //forma normal de importar
            //products:products,

            //Si per defecte no té res, es pot iniciar amb un array buit.
            products:[]
        };
    },
    actions:{
        async fill(){
            //.default fa que el json sigui rebut amb un pare anomenat default, per a poder ser llegit correctament.
            this.products=(await import("@/data/products.json")).default
            }
     
    }
   
});