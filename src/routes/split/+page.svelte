<script lang="ts">
  import { onMount } from "svelte";
  import { form as formValidator, field, style } from "svelte-forms";
  import { required } from "svelte-forms/validators";

  const prefix = field("prefix", "", [required()], { checkOnInit: true });
  const artistColumn = field("artist_column", "Artist");
  const encoding = field("encoding", "utf-8");
  const file = field("file", "", [required()], { checkOnInit: true });
  const splitForm = formValidator(prefix, artistColumn, encoding, file);

  const download = async (
    base64Data: string,
    filename: string,
    filetype: string
  ) => {
    const linkSource = `data:${filetype};base64,${base64Data}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = filename;
    downloadLink.click();
  };

  export let form: { base64Data: string; filename: string; filetype: string };
  onMount(async () => {
    if (form?.base64Data && form?.filename && form?.filetype) {
      download(form.base64Data, form.filename, form.filetype);
    }
  });
</script>

<div class="flex justify-center align-middle items-center">
  <div class="card w-96 bg-base-300 shadow-xl">
    <div class="card-body">
      <h2 class="card-title">Split distributor report</h2>
      <form method="POST" enctype="multipart/form-data">
        <div class="form-control w-full max-w-xs">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="label">
            <span class="label-text">Prefix</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            class="input input-bordered input-primary w-full max-w-xs"
            name="prefix"
            bind:value={$prefix.value}
            use:style={{
              field: prefix,
              valid: "input-primary",
              invalid: "input-error",
            }}
          />
        </div>

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

        <div class="card-actions justify-end mt-4">
          <button class="btn btn-primary" disabled={!$splitForm.valid}
            >Submit</button
          >
          <button
            class="btn btn-secondary"
            formaction=""
            on:click|preventDefault={splitForm.reset}>Reset form</button
          >
        </div>
      </form>
    </div>
  </div>
</div>
