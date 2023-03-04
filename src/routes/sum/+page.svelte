<script lang="ts">
  import { onMount } from "svelte";
  import { form as formValidator, field, style } from "svelte-forms";
  import { required } from "svelte-forms/validators";
  // @ts-ignore
  import SvelteTable from "svelte-table";

  const artistColumn = field("artist_column", "Artist");
  const netRevenueColumn = field("net_revenue_column", "Net Revenue in USD");
  const encoding = field("encoding", "utf-8");
  const file = field("file", "", [required()], { checkOnInit: true });
  const splitForm = formValidator(
    artistColumn,
    netRevenueColumn,
    encoding,
    file
  );

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
    splitForm.reset();
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
            <div class="btn btn-disabled" role="status">
              <svg
                aria-hidden="true"
                class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span class="sr-only">Loading...</span>
            </div>
          {/if}

          {#if !form}
            <button
              class="btn btn-primary"
              disabled={!$splitForm.valid}
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
