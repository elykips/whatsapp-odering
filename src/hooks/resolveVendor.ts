import { HookContext } from '@feathersjs/feathers';
import { getVendor } from '../db/platformDb';

export const resolveVendor = async (context: HookContext) => {
  const vendorId = context.data?.vendor_id;
  if (!vendorId) throw new Error('vendor_id required');

  const vendor = await getVendor(vendorId);
  if (!vendor || vendor.status !== 'ACTIVE') {
    throw new Error('Vendor not active');
  }

  context.params.vendor = vendor;
  return context;
};
