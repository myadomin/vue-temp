<template>
  <div>
    <ul v-if="cartProducts.length">
      <li v-for="product in cartProducts" :key="product.id">
        <span>{{ product.title }} - ${{ product.price }} * {{ product.quantity }}</span>
      </li>
    </ul>
    <p v-else>Please add some products to cart.</p>
    <p>Total: ${{ cartTotalPrice }}</p>
    <button @click="checkout" :disabled="!cartProducts.length">Checkout</button>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters('shopCart', [
      'cartTotalPrice'
    ]),
    ...mapState('shopCart', ['cartProducts'])
  },
  methods: {
    ...mapActions('shopCart', [
      'checkout'
    ])
  }
}
</script>

<style scoped>
li, p {
  margin: 10px 0
}
</style>
