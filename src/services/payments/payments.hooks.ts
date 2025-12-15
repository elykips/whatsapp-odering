import { authenticateInternal } from '../../hooks/authenticateInternal'
import { resolveVendor } from '../../hooks/resolveVendor'
import { enforceCapability } from '../../hooks/enforceCapability'
import { enforceRateLimit } from '../../hooks/enforceRateLimit'

export const paymentsHooks = {
  before: {
    all: [authenticateInternal, resolveVendor],
    create: [
      enforceCapability('payments.mpesa_stk'),
      enforceRateLimit('payments.mpesa_stk', 3)
    ],
    patch: [
      enforceCapability('payments.mpesa_stk')
    ]
  }
}
