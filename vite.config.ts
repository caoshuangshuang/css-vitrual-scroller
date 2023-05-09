/*
 * @Description: 
 * @version: 1.0.0
 * @Author: 曹双双
 * @Date: 2023-04-10 15:06:04
 * @LastEditors: 曹双双
 * @LastEditTime: 2023-04-17 14:05:26
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve:{
    alias:[
      {
        find:'@',
        replacement:resolve(__dirname,'src')
      }
    ]
  }
})
