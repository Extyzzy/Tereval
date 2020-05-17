<template>
  <q-page>
    <div class="login-container">
      <div class="text-header">
        <h3>
          {{ $t("loginPage.weAre") }}
          <span class="company-name">{{ $t("loginPage.nameOfCompany") }}</span>
        </h3>
        <p>{{ $t("loginPage.subText") }}</p>
      </div>
      <div class="form">
        <q-input
          v-model="email"
          v-bind:label="$t('loginPage.form.username')"
        ></q-input>
        <q-input
          v-model="password"
          v-bind:label="$t('loginPage.form.password')"
          type="password"
        ></q-input>
        <div class="footer-info">
          <div>
            <q-checkbox
              type="checkbox"
              :value="remember"
              @input="remember = !remember"
            />
            <span>{{ $t("loginPage.form.remember") }}</span>
          </div>
          <a class="password" href="">{{ $t("loginPage.form.forget") }}</a>
        </div>
        <div class="buttons">
          <q-btn
            :loading="loadingLog"
            color="blue-9"
            @click="simulateProgress()"
            label="Login"
            style="margin-right: 20px;"
          ></q-btn>
          <q-btn outline color="primary" label="Sign Up"></q-btn>
        </div>
        <p class="terms">
          {{ $t("loginPage.gdpr.text") }}
          <a class="bold-text" href="">{{ $t("loginPage.gdpr.terms") }}</a>
          &<br />
          <a class="bold-text" href="">{{ $t("loginPage.gdpr.privacy") }}</a>
        </p>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      remember: false,
      loadingLog: false,
      progress: false,
      email: "",
      password: ""
    };
  },
  components: {},
  name: "Main",
  methods: {
    simulateProgress() {
      // we set loading state
      this.loadingLog = true;
      // simulate a delay
      setTimeout(() => {
        // we're done, we reset loading state
        this.loadingLog = false;
      }, 2000);
    }
  }
};
</script>

<style scoped>
.login-container {
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 100%;
}
.bold-text {
  font-weight: bold;
}
.terms {
  color: grey;
  margin-top: 50px;
}
.buttons {
  margin-top: 20px;
}
.password {
  margin-top: 10px;
}
.footer-info {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.form {
  width: 400px;
  margin: 0 auto;
}
.company-name {
  color: #1464c0;
  font-weight: bold;
}
.text-header {
  width: 400px;
  margin: 0 auto;
  text-align: center;
}

@media only screen and (max-width: 475px) {
  .form,
  .text-header {
    width: 100%;
    padding: 25px;
  }
  .text-header h3 {
    font-size: 2.5em;
  }
  .text-header p {
    font-size: 10px;
  }
}
</style>
