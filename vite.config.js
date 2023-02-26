/** @type {import('vite').UserConfig} */
export default {
  server: {
    // fake userself as the CAS logged in user
    headers: {'Server-Timing': `delta-uid; desc=${process.env['USER']}`}
  }
}