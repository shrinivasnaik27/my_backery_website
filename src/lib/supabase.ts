import { createClient } from '@supabase/supabase-js';
import { OrderEnquiry, CakeEnquiry, Review, OrderStatus, ParcelDetails } from '../types';

// Provided Supabase Project Details
export const SUPABASE_PROJECT_ID = 'wuhflfqujlfdmpuagrtl';
export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || `https://${SUPABASE_PROJECT_ID}.supabase.co`;
export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_FQWJMaV-ZQY6QhN1xR5-4A_2dJkOCRs';

// Initialize the Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface SupabaseSyncStatus {
  isConnected: boolean;
  lastSyncedAt?: string;
  errorMessage?: string;
}

/**
 * Checks connectivity to the Supabase backend.
 */
export async function checkSupabaseConnection(): Promise<SupabaseSyncStatus> {
  try {
    const { error } = await supabase.from('order_enquiries').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
        return {
          isConnected: true,
          errorMessage: 'Connected to Supabase! (Tables need initial schema run)',
          lastSyncedAt: new Date().toISOString(),
        };
      }
      return {
        isConnected: false,
        errorMessage: error.message,
      };
    }
    return {
      isConnected: true,
      lastSyncedAt: new Date().toISOString(),
    };
  } catch (err: any) {
    return {
      isConnected: false,
      errorMessage: err?.message || 'Unable to connect to Supabase',
    };
  }
}

/**
 * Saves a new or updated customer order / parcel to Supabase.
 */
export async function saveOrderToSupabase(order: OrderEnquiry): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
      order_ref: order.tokenNumber || order.id,
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      pickup_preference: order.pickupPreference,
      delivery_address: order.address || null,
      special_instructions: order.specialInstructions || null,
      items: order.items,
      estimated_total: order.estimatedTotal,
      status: order.status,
      token_number: order.tokenNumber,
      order_type: order.orderType,
      parcel_details: order.parcelDetails || null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('order_enquiries')
      .upsert(payload, { onConflict: 'order_ref' });

    if (error) {
      if (error.message?.includes('column') && (error.message.includes('token_number') || error.message.includes('parcel_details'))) {
        const fallbackPayload = {
          order_ref: order.tokenNumber || order.id,
          customer_name: order.customerName,
          customer_phone: order.customerPhone,
          pickup_preference: order.pickupPreference,
          delivery_address: order.address || null,
          special_instructions: order.specialInstructions || null,
          items: order.items,
          estimated_total: order.estimatedTotal,
          status: order.status,
          updated_at: new Date().toISOString(),
        };

        const fallbackRes = await supabase
          .from('order_enquiries')
          .upsert(fallbackPayload, { onConflict: 'order_ref' });

        if (fallbackRes.error) {
          console.warn('Supabase order fallback upsert warning:', fallbackRes.error);
          return { success: false, error: fallbackRes.error.message };
        }
        return { success: true };
      }

      console.warn('Supabase order upsert warning:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.warn('Supabase sync network exception:', err);
    return { success: false, error: err?.message };
  }
}

/**
 * Updates an order status or parcel details in Supabase.
 */
export async function updateOrderStatusInSupabase(
  orderRef: string,
  status: OrderStatus,
  parcelDetails?: ParcelDetails
): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (parcelDetails) {
      updateData.parcel_details = parcelDetails;
    }

    const { error } = await supabase
      .from('order_enquiries')
      .update(updateData)
      .eq('order_ref', orderRef);

    if (error) {
      if (error.message?.includes('parcel_details')) {
        await supabase
          .from('order_enquiries')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('order_ref', orderRef);
      }
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

/**
 * Saves a celebration cake enquiry to Supabase.
 */
export async function saveCakeEnquiryToSupabase(cake: CakeEnquiry): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
      enquiry_ref: cake.id,
      customer_name: cake.customerName,
      customer_phone: cake.customerPhone,
      occasion: cake.occasion,
      flavor: cake.flavor,
      weight_kg: cake.weightKg,
      is_eggless: cake.eggless,
      message_on_cake: cake.messageOnCake || null,
      pickup_date: cake.pickupDate,
      pickup_time: cake.pickupTime,
      notes: cake.notes || null,
      status: cake.status || 'new',
      estimated_price: cake.estimatedPrice || null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('cake_enquiries')
      .upsert(payload, { onConflict: 'enquiry_ref' });

    if (error) {
      console.warn('Supabase cake enquiry sync warning:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.warn('Supabase cake sync exception:', err);
    return { success: false, error: err?.message };
  }
}

/**
 * Saves a customer review to Supabase.
 */
export async function saveReviewToSupabase(review: Review): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
      author_name: review.author,
      rating: review.rating,
      comment: review.comment,
      source: review.source || 'Direct Customer',
      is_verified: review.isVerified,
      status: review.status,
    };

    const { error } = await supabase
      .from('customer_reviews')
      .insert([payload]);

    if (error) {
      console.warn('Supabase review insert warning:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.warn('Supabase review sync exception:', err);
    return { success: false, error: err?.message };
  }
}

/**
 * Fetches latest orders & parcels from Supabase.
 */
export async function fetchOrdersFromSupabase(): Promise<OrderEnquiry[] | null> {
  try {
    const { data, error } = await supabase
      .from('order_enquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error || !data) return null;

    return data.map((row: any) => ({
      id: row.id || row.order_ref,
      tokenNumber: row.token_number || row.order_ref,
      orderType: row.order_type || 'online-whatsapp',
      customerName: row.customer_name,
      customerPhone: row.customer_phone,
      pickupPreference: row.pickup_preference || 'store-pickup',
      address: row.delivery_address || undefined,
      specialInstructions: row.special_instructions || '',
      items: row.items || [],
      estimatedTotal: Number(row.estimated_total) || 0,
      createdAt: row.created_at || new Date().toISOString(),
      status: row.status || 'received',
      parcelDetails: row.parcel_details || undefined,
    }));
  } catch {
    return null;
  }
}

/**
 * Fetches celebration cake bookings from Supabase.
 */
export async function fetchCakeEnquiriesFromSupabase(): Promise<CakeEnquiry[] | null> {
  try {
    const { data, error } = await supabase
      .from('cake_enquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error || !data) return null;

    return data.map((row: any) => ({
      id: row.id || row.enquiry_ref,
      customerName: row.customer_name,
      customerPhone: row.customer_phone,
      occasion: row.occasion,
      flavor: row.flavor,
      weightKg: row.weight_kg,
      eggless: Boolean(row.is_eggless),
      messageOnCake: row.message_on_cake || '',
      pickupDate: row.pickup_date,
      pickupTime: row.pickup_time,
      notes: row.notes || '',
      estimatedPrice: row.estimated_price ? Number(row.estimated_price) : undefined,
      status: row.status || 'new',
      createdAt: row.created_at || new Date().toISOString(),
    }));
  } catch {
    return null;
  }
}

/**
 * Updates full order details in Supabase.
 */
export async function updateOrderInSupabase(
  orderRef: string,
  updates: Partial<OrderEnquiry>
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload: any = {
      updated_at: new Date().toISOString(),
    };
    if (updates.customerName !== undefined) payload.customer_name = updates.customerName;
    if (updates.customerPhone !== undefined) payload.customer_phone = updates.customerPhone;
    if (updates.pickupPreference !== undefined) payload.pickup_preference = updates.pickupPreference;
    if (updates.address !== undefined) payload.delivery_address = updates.address;
    if (updates.specialInstructions !== undefined) payload.special_instructions = updates.specialInstructions;
    if (updates.estimatedTotal !== undefined) payload.estimated_total = updates.estimatedTotal;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.parcelDetails !== undefined) payload.parcel_details = updates.parcelDetails;
    if (updates.items !== undefined) payload.items = updates.items;

    const { error } = await supabase
      .from('order_enquiries')
      .update(payload)
      .or(`order_ref.eq.${orderRef},id.eq.${orderRef}`);

    if (error) {
      console.warn('Supabase update order error:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

/**
 * Deletes an order from Supabase.
 */
export async function deleteOrderFromSupabase(
  orderRef: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('order_enquiries')
      .delete()
      .or(`order_ref.eq.${orderRef},id.eq.${orderRef}`);

    if (error) {
      console.warn('Supabase delete order error:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

/**
 * Updates a celebration cake booking in Supabase.
 */
export async function updateCakeEnquiryInSupabase(
  enquiryRef: string,
  updates: Partial<CakeEnquiry>
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload: any = {
      updated_at: new Date().toISOString(),
    };
    if (updates.customerName !== undefined) payload.customer_name = updates.customerName;
    if (updates.customerPhone !== undefined) payload.customer_phone = updates.customerPhone;
    if (updates.occasion !== undefined) payload.occasion = updates.occasion;
    if (updates.flavor !== undefined) payload.flavor = updates.flavor;
    if (updates.weightKg !== undefined) payload.weight_kg = updates.weightKg;
    if (updates.eggless !== undefined) payload.is_eggless = updates.eggless;
    if (updates.messageOnCake !== undefined) payload.message_on_cake = updates.messageOnCake;
    if (updates.pickupDate !== undefined) payload.pickup_date = updates.pickupDate;
    if (updates.pickupTime !== undefined) payload.pickup_time = updates.pickupTime;
    if (updates.notes !== undefined) payload.notes = updates.notes;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.estimatedPrice !== undefined) payload.estimated_price = updates.estimatedPrice;

    const { error } = await supabase
      .from('cake_enquiries')
      .update(payload)
      .or(`enquiry_ref.eq.${enquiryRef},id.eq.${enquiryRef}`);

    if (error) {
      console.warn('Supabase update cake error:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

/**
 * Deletes a celebration cake booking from Supabase.
 */
export async function deleteCakeEnquiryFromSupabase(
  enquiryRef: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('cake_enquiries')
      .delete()
      .or(`enquiry_ref.eq.${enquiryRef},id.eq.${enquiryRef}`);

    if (error) {
      console.warn('Supabase delete cake error:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}
