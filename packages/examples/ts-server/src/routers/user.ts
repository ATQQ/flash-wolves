import { Router } from 'flash-wolves'

const router = new Router('user', { requiresAuth: false })

router.get(
  'hello',
  (req, res) => {
    res.success()
  },
  { isAdmin: false }
)
router.get('hello2', (req, res) => {
  res.success()
})
export default router
