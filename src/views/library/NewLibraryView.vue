<script setup></script>

<template>
  <div class="flex flex-col">
    <div
      class="px-5 py-2.5 min-h-[63px] flex justify-center border-b-[0.25px] border-gray-300 bg-gray-100"
    >
      <div class="max-w-[1200px] flex items-center justify-center flex-wrap font-light w-full">
        <div class="flex text-[15px] items-center gap-2">
          <span>Create New Library</span>
        </div>
      </div>
    </div>

    <div class="flex bg-white flex-col grow shrink-0 px-5 relative">
      <form class="py-10 relative flex justify-center mt-0">
        <div class="w-full max-w-[40rem]">
          <div class="">
            <div class="text-[15px] text-gray-700 font-semibold">Library Name</div>
            <label for="" class="text-[13px] text-gray-500 font-light max-w-full"
              >Give this library a unique name. For example, ai-research-papers-for-exam.</label
            >
            <div class="mb-8 a1">
              <div class="w-full flex">
                <input
                  class="w-full text-[13px] py-[5px] px-2.5 outline-0 bg-white text-sm text-gray-800 border border-[#cfd7e6] rounded-sm"
                  maxlength="30"
                  autocomplete="off"
                  placeholder="library-name"
                  aria-describedby="nameError"
                  aria-invalid=""
                  type="text"
                />
              </div>
            </div>
            <div class="text-[15px] text-gray-700 font-semibold">Visibility</div>
            <label for="" class="text-[13px] text-gray-500 font-light max-w-full"
              >Choose who can see and add to this library.</label
            >
            <ul class="a1 mb-2.5 pb-2.5 border-b border-gray-200">
              <li
                class="px-[15px] py-2.5 items-center flex cursor-pointer rounded-[6px] bg-white shadow-[0_0_0_2px_#009799] mb-2.5"
              >
                <div class="ml-2.5 grow shrink basis-auto">
                  <div class="text-[14px]">Private Library</div>
                  <div class="text-[12px] text-gray-500">
                    Only you the creator can view and add to the library.
                  </div>
                </div>
                <div class="flex items-center">
                  <span class="material-symbols-outlined"> lock </span>
                </div>
              </li>
              <li
                class="px-[15px] py-2.5 items-center flex cursor-pointer rounded-[6px] bg-white mb-2.5 shadow-[0_0_0_1px_#E3E7EF]"
              >
                <div class="ml-2.5 grow shrink basis-auto">
                  <div class="text-[14px]">Public Library</div>
                  <div class="text-[12px] text-gray-500">
                    Only you the creator can view and add to the library.
                  </div>
                </div>
                <div class="flex items-center">
                  <span class="material-symbols-outlined"> lock_open_right </span>
                </div>
              </li>
            </ul>

            <div class="flex mt-5 justify-between text-[13px]">
                <RouterLink :to="{ name: 'Dashboard' }" class="mr-4  h-[32px] flex items-center justify-center text-center py-1 px-4 bg-white text-[#009799] rounded-[4px] border border-[#009799] hover:bg-[#efffff]">Cancel</RouterLink>
                <button class="shadow-[0_0_0_1px_#E3E7EF] bg-[#009799] text-white h-[32px] flex items-center justify-center text-center py-1 px-4 rounded-[4px] cursor-pointer border border-[#009799] hover:bg-[#006b6c]">Create library</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.a1 {
  margin-top: 15px;
}
</style>
