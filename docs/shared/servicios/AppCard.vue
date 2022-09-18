<template>
  <div class="container">
    <img :src="image" alt="" />
    <div class="right">
      <h5>{{ name }}</h5>
      <p>
        {{ summary }}
      </p>
      <!-- <a :href="link"></a> -->
      <div class="links">
        <a v-for="link in links" :href="link.url">
          <img
            v-if="link.store === 'app-store'"
            class="apple"
            src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/es-es?size=250x83"
            alt="Download on the App Store"
          />
          <img
            v-else-if="link.store === 'f-droid'"
            class="fdroid"
            src="../../images/f-droid-badge.png"
            alt="Download on F-Droid"
          />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string;
  image: string;
  summary: string;
  links: {
    store: "app-store" | "play-store" | "f-droid";
    url: string;
  }[]; // TODO make this list of Objects of the form { store: "fdroid" | "playstore" | "appstore", url: string }
}>();
</script>

<style scoped>
.container {
  width: 100%;
  height: 150px;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  padding: 1rem 0.95rem;
  border: 1px solid #aaaaaa55;
  border-radius: 15px;
  box-shadow: 0px 4px 10px 0px #aaaaaa55;
}

.container.margin-top {
  margin-top: 0.75rem;
}

.container > img {
  border-radius: 15px;
}

.container > .right {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
  overflow-y: hidden;
  justify-content: space-between;
  padding: 0.2rem 0;
}

.container > .right > h5 {
  font-size: 20px;
  font-weight: 600;
}

.container > .right > p {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  /* overflow: hidden; */
  text-overflow: ellipsis;
  margin: 0;
  padding-bottom: 15px;
  margin-bottom: 0.75rem;
  font-size: 14px;
  line-height: 16px;
}

.container > .right > .links {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 1rem;
  height: 100%;
  max-height: 100%;
}

.container > .right > .links > a {
  margin-top: -5px;
  height: 100%;
  max-height: 100%;
  position: relative;
  background: transparent;
}

.container > .right > .links > a > img.apple {
  margin-top: 5px;
  border-radius: 15px;
  height: 100%;
  max-height: 100%;
  width: auto;
  object-position: center;
}

.container > .right > .links > a > img.fdroid {
  border-radius: 15px;
  height: 50px;
  width: auto;
  padding: 0;
  margin-top: 0;
  background: transparent;
}

/* .container > .right > .links > a {
  display: flex;
  flex-direction: row;
  gap: 1rem;
} */
</style>
