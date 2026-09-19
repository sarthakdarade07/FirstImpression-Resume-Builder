import api from '../api/axios';

const FALLBACK_DAILY_JOB = {
  id: 1,
  companyName: 'Stripe',
  roleTitle: 'Frontend Software Engineer',
  location: 'Remote / US & Global',
  applyUrl: 'https://stripe.com/jobs',
  jobType: 'Full-time',
  salary: '$140,000 - $180,000',
  featuredDate: new Date().toISOString().split('T')[0]
};

export const jobApi = {
  /**
   * Fetches today's featured job opening from /api/jobs/daily
   */
  async getDailyJob() {
    try {
      const response = await api.get('/jobs/daily');
      return response.data || FALLBACK_DAILY_JOB;
    } catch (err) {
      console.warn('Failed to fetch daily job from backend, using default opening:', err);
      return FALLBACK_DAILY_JOB;
    }
  }
};

export default jobApi;
