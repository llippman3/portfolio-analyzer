import { supabase } from '../lib/supabase';

/**
 * Save a portfolio to Supabase
 * @param {string} portfolioName - Name of the portfolio
 * @param {object} portfolioData - The complete portfolio data including holdings and metrics
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const savePortfolio = async (portfolioName, portfolioData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be logged in to save portfolios');
    }

    const { data, error } = await supabase
      .from('portfolios')
      .insert([
        {
          user_id: user.id,
          portfolio_name: portfolioName,
          portfolio_data: portfolioData,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error saving portfolio:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get all portfolios for the current user
 * @returns {Promise<{success: boolean, data?: array, error?: string}>}
 */
export const getUserPortfolios = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be logged in to view portfolios');
    }

    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete a portfolio
 * @param {string} portfolioId - ID of the portfolio to delete
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deletePortfolio = async (portfolioId) => {
  try {
    const { error } = await supabase
      .from('portfolios')
      .delete()
      .eq('id', portfolioId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update a portfolio
 * @param {string} portfolioId - ID of the portfolio to update
 * @param {string} portfolioName - New name (optional)
 * @param {object} portfolioData - New data (optional)
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const updatePortfolio = async (portfolioId, portfolioName, portfolioData) => {
  try {
    const updates = {};
    if (portfolioName) updates.portfolio_name = portfolioName;
    if (portfolioData) updates.portfolio_data = portfolioData;

    const { data, error } = await supabase
      .from('portfolios')
      .update(updates)
      .eq('id', portfolioId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error updating portfolio:', error);
    return { success: false, error: error.message };
  }
};

