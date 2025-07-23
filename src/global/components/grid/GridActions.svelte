<script lang="ts">
  import Link from "../ux/Link.svelte"
import type { GridOptionsInterface } from '@/global/components/grid/types';
  import Button from "@/global/components/ux/Button.svelte";

  export let options: GridOptionsInterface
  export let item
  export let index
  export let linkCls
  //   function getLinkButton(ref) {
  //     if (ref) {
  //       if (ref.current) {
  //         console.log(ref.current.getLinkButton())
  //       }
  //     }
  //   }
  const linkTo = typeof options.editUrl == "function" ? options.editUrl(item) : options.editUrl
</script>
{#if options.enableEdit}
<Link routeApp={options.routeApp} className={linkCls} to={linkTo}>
  <i class="bi bi-pencil-square"></i> Edit
</Link>
{/if}
{#if options.enableDelete}
  {#if options.callbackActions.delete}
    <Button caption="" icon="bi bi-trash"  on:click={() => options.callbackActions.delete(item, index, options)}/>
    {:else}
    <Link routeApp={options.routeApp} className={linkCls} to={linkTo}>
    <i class="bi bi-trash"></i> Delete
    </Link>
  {/if}

{/if}