<script>
  import "../app.postcss";
  import { page } from "$app/stores";
  import ElectricityLogo from "$components/ElectricityLogo.svelte";
  const routes = [
    { href: "/", name: "Home", tooltip: "Home" },
    { href: "/split", name: "Split", tooltip: "Split" },
  ];
</script>

<div class="drawer drawer-mobile text-sm">
  <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
  <div
    class="drawer-content flex flex-col items-center justify-center relative"
  >
    <!-- Page content here -->
    <label
      for="my-drawer-2"
      class="drawer-button btn btn-square lg:hidden absolute inset-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>
    </label>
    <div class="flex flex-col w-full h-full items-center justify-center">
      <div class="navbar bg-base-200 flex">
        <a
          href="/"
          class="flex-1 ml-14 lg:m-0 font-semibold gap-2 text-xl text-base-content"
        >
          <ElectricityLogo /> Electricity Scripts
        </a>
      </div>
      <div
        class="flex w-full h-full items-center justify-center overflow-y-hidden"
      >
        <slot />
      </div>
    </div>
  </div>
  <div class="drawer-side">
    <label for="my-drawer-2" class="drawer-overlay" />
    <ul class="menu p-4 w-72 bg-base-200 text-base-content">
      <!-- Sidebar content here -->
      <div class="mt-12 space-y-2">
        {#each routes as route}
          <li>
            <a
              href={route.href}
              class:active={$page.url.pathname === route.href}
            >
              {route.name}
            </a>
          </li>
        {/each}
      </div>
    </ul>
  </div>
</div>
>
