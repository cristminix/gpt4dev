<script lang="ts">
    import { writable } from "svelte/store";

const isRunning = writable(false);
const isFinished = writable(false);
let message = writable("");
let totalIndex = 0
let progressIndex = 0

export function startItem(index:number,mode:string="single"){}

export let onComplete=async()=>{

}
export const setProgress=()=>{

}
export const triggerQueue=(startQueue=false)=>{}


export function getProgress(){}
export const triggerResetQueue=()=>{

}
export function getNextIndex(){
    return totalIndex
}
</script>