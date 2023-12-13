<script lang="ts">
  import Spinner from "$components/Spinner.svelte";
  import { onMount } from "svelte";
  import { form as formValidator, field, style } from "svelte-forms";
  import { required } from "svelte-forms/validators";
  // @ts-ignore
  import SvelteTable from "svelte-table";

  const artistColumn = field("artist_column", "Artist");
  const netRevenueColumn = field("net_revenue_column", "Net Revenue in USD");
  const encoding = field("encoding", "utf-8");
  const file = field("file", "", [required()], { checkOnInit: true });
  const sumForm = formValidator(artistColumn, netRevenueColumn, encoding, file);

  export let form: {
    schema: {
      fields: { name: string; type: string }[];
    };
    data: Record<string, string | number>[];
  } | null;
  let rows: Record<string, string | number>[] = [];
  let columns: {
    key: number;
    title: string;
    value: (v: Record<string, string>) => string;
    sortable: boolean;
    filterValue: ((v: Record<string, string>) => string) | undefined;
  }[] = [];
  let spinner = false;

  const reset = () => {
    sumForm.reset();
    columns = [];
    rows = [];
    form = null;
    spinner = false;
  };

  const showSpinner = () => {
    spinner = true;
  };

  onMount(async () => {
    if (form?.schema && form?.data) {
      rows = form.data;
      columns = form.schema.fields.map((field, index) => ({
        key: index,
        title: field.name,
        value: (v: Record<string, string>) => v[field.name],
        sortable: true,
        filterValue:
          field.type === "string"
            ? (v) => v[field.name].charAt(0).toLowerCase()
            : undefined,
      }));
    }
  });
</script>

<div class="flex flex-col justify-center items-center h-full w-full">
  <div class="card w-96 bg-base-300 shadow-xl">
    <div class="card-body">
      {#if !form}
        <h2 class="card-title">Sum distributor report</h2>
      {/if}

      <form method="POST" enctype="multipart/form-data">
        {#if !form}
          <div class="form-control w-full max-w-xs">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label class="label">
              <span class="label-text">Artist column name (optional)</span>
            </label>
            <input
              type="text"
              placeholder="Type here"
              class="input input-bordered input-primary w-full max-w-xs"
              name="artist_column"
              bind:value={$artistColumn.value}
            />
          </div>

          <div class="form-control w-full max-w-xs">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label class="label">
              <span class="label-text">Net revenue column name (optional)</span>
            </label>
            <input
              type="text"
              placeholder="Type here"
              class="input input-bordered input-primary w-full max-w-xs"
              name="net_revenue_column"
              bind:value={$netRevenueColumn.value}
            />
          </div>

          <div class="form-control w-full max-w-xs">
            <!-- svelte-ignore a11y-label-has-associated-control -->

            <label class="label">
              <span class="label-text">Encoding (utf-16 for Bandcamp)</span>
            </label>
            <select
              class="select select-bordered select-primary w-full max-w-xs"
              bind:value={$encoding.value}
            >
              <option selected>utf-8</option>
              <option>utf-16</option>
            </select>
          </div>

          <div class="form-control w-full max-w-xs">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label class="label">
              <span class="label-text">CSV Report</span>
            </label>
            <input
              type="file"
              class="file-input file-input-bordered file-input-primary w-full max-w-xs"
              name="file"
              accept="text/csv"
              bind:value={$file.value}
              use:style={{
                field: file,
                valid: "input-primary",
                invalid: "input-error",
              }}
            />
          </div>
        {/if}

        <div
          class="card-actions {form ? 'justify-center' : 'justify-end'} mt-4"
        >
          {#if !form && spinner}
            <Spinner />
          {/if}

          {#if !form}
            <button
              class="btn btn-primary"
              disabled={!$sumForm.valid}
              on:click={showSpinner}
            >
              Submit
            </button>
          {/if}

          <button
            class="btn btn-secondary"
            formaction=""
            on:click|preventDefault={reset}>Reset form</button
          >
        </div>
      </form>
    </div>
  </div>
  <div
    class="overflow-x-auto justify-center align-middle items-center w-full p-10"
  >
    <SvelteTable {columns} {rows} classNameTable="table flex-col" />
  </div>
</div>
