import { Trip } from '../types';
import { DollarSign, Clock, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';

interface FinanceHubProps {
  trip: Trip;
}

export default function FinanceHub({ trip }: FinanceHubProps) {
  // Aggregate planning and actual calculations
  const calcFinances = () => {
    let expectedCost = 0;
    let actualCost = 0;
    
    // Sum places
    trip.places.forEach(p => {
      expectedCost += p.expectedCost;
      // If completed or actualCost is explicitly logged, sum actual
      actualCost += p.completed ? p.actualCost : p.expectedCost;
    });

    // Sum activities
    trip.activities.forEach(a => {
      expectedCost += a.expectedCost;
      actualCost += a.completed ? a.actualCost : a.expectedCost;
    });

    // Sum transport
    trip.transport.forEach(t => {
      expectedCost += t.expectedCost;
      actualCost += t.completed ? t.actualCost : t.expectedCost;
    });

    // Sum dining
    trip.dining.forEach(d => {
      expectedCost += d.expectedCost;
      actualCost += d.completed ? d.actualCost : d.expectedCost;
    });

    return { expectedCost, actualCost };
  };

  const { expectedCost, actualCost } = calcFinances();
  const limitPercent = Math.min(Math.round((actualCost / trip.budget) * 100), 100);
  const isOverBudget = actualCost > trip.budget;
  const remainingBudget = Math.max(0, trip.budget - actualCost);

  const symbol = trip.currency ? (
    trip.currency === 'USD' ? '$' :
    trip.currency === 'EUR' ? '€' :
    trip.currency === 'GBP' ? '£' :
    trip.currency === 'CHF' ? 'CHF ' :
    trip.currency === 'JPY' ? '¥' :
    trip.currency === 'CAD' ? 'CA$' :
    trip.currency === 'AUD' ? 'A$' :
    trip.currency === 'INR' ? '₹' : '$'
  ) : '$';

  // Category breakdowns
  const getCategoryStats = () => {
    const categories = [
      {
        name: 'Accommodations & Places',
        expected: trip.places.reduce((sum, p) => sum + p.expectedCost, 0),
        actual: trip.places.reduce((sum, p) => sum + (p.completed ? p.actualCost : p.expectedCost), 0),
        color: 'bg-emerald-600',
        textColor: 'text-emerald-700'
      },
      {
        name: 'Activities & Excursions',
        expected: trip.activities.reduce((sum, a) => sum + a.expectedCost, 0),
        actual: trip.activities.reduce((sum, a) => sum + (a.completed ? a.actualCost : a.expectedCost), 0),
        color: 'bg-amber-600',
        textColor: 'text-amber-700'
      },
      {
        name: 'Transport & Transit',
        expected: trip.transport.reduce((sum, t) => sum + t.expectedCost, 0),
        actual: trip.transport.reduce((sum, t) => sum + (t.completed ? t.actualCost : t.expectedCost), 0),
        color: 'bg-indigo-600',
        textColor: 'text-indigo-700'
      },
      {
        name: 'Dining & Food',
        expected: trip.dining.reduce((sum, d) => sum + d.expectedCost, 0),
        actual: trip.dining.reduce((sum, d) => sum + (d.completed ? d.actualCost : d.expectedCost), 0),
        color: 'bg-rose-600',
        textColor: 'text-rose-700'
      }
    ];
    return categories;
  };

  const categories = getCategoryStats();

  return (
    <div className="space-y-6">
      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div id="card_total_budget" className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 font-sans text-xs uppercase tracking-wider font-bold">Allocated Budget</span>
            <span className="p-1.5 bg-slate-100 rounded-lg text-slate-600">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <h4 className="font-mono text-3xl font-extrabold text-slate-900">{symbol}{trip.budget.toLocaleString()}</h4>
            <p className="text-slate-400 text-xs mt-1">Starting reference limit</p>
          </div>
        </div>

        <div id="card_expected_cost" className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 font-sans text-xs uppercase tracking-wider font-bold">Planned Cost</span>
            <span className="p-1.5 bg-slate-100 rounded-lg text-slate-600">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <h4 className="font-mono text-3xl font-extrabold text-slate-800">{symbol}{expectedCost.toLocaleString()}</h4>
            <p className="text-slate-400 text-xs mt-1">Total items estimated</p>
          </div>
        </div>

        <div id="card_actual_cost" className={`border p-5 rounded-2xl flex flex-col justify-between shadow-sm ${isOverBudget ? 'bg-rose-50/50 border-rose-200' : 'bg-white border-slate-200'}`}>
          <div className="flex justify-between items-start">
            <span className={`font-sans text-xs uppercase tracking-wider font-bold ${isOverBudget ? 'text-rose-600' : 'text-slate-400'}`}>Logged Expense</span>
            <span className={`p-1.5 rounded-lg ${isOverBudget ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
              {isOverBudget ? <AlertTriangle className="w-4 h-4 animate-pulse" /> : <DollarSign className="w-4 h-4" />}
            </span>
          </div>
          <div className="mt-4">
            <h4 className={`font-mono text-3xl font-extrabold ${isOverBudget ? 'text-rose-700' : 'text-emerald-700'}`}>{symbol}{actualCost.toLocaleString()}</h4>
            <p className={`text-xs mt-1 ${isOverBudget ? 'text-rose-500 font-medium' : 'text-slate-400'}`}>
              {isOverBudget ? `Over budget by ${symbol}${(actualCost - trip.budget).toLocaleString()}!` : 'Based on completed items'}
            </p>
          </div>
        </div>

        <div id="card_remaining_budget" className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 font-sans text-xs uppercase tracking-wider font-bold">Remaining Fund</span>
            <span className="p-1.5 bg-slate-100 rounded-lg text-slate-600">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <h4 className="font-mono text-3xl font-extrabold text-slate-900">{symbol}{remainingBudget.toLocaleString()}</h4>
            <p className="text-slate-400 text-xs mt-1">
              {limitPercent >= 100 ? 'Budget fully utilized' : `${100 - limitPercent}% allowance left`}
            </p>
          </div>
        </div>
      </div>

      {/* Modern High-End Visual Comparison Bar */}
      <div id="budget_progress_card" className="bg-slate-900 text-slate-100 p-6 rounded-2xl border border-slate-800 shadow-md">
        <h3 className="font-sans text-sm font-semibold tracking-wide text-slate-300 mb-4 uppercase">Overall Budget Consumption</h3>
        <div className="flex items-center justify-between font-mono text-xs mb-2">
          <span>0%</span>
          <span className="text-emerald-400 font-bold">{limitPercent}% Consumed</span>
          <span>Budget Limit ({symbol}{trip.budget})</span>
        </div>
        <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden flex">
          <div 
            className={`h-full transition-all duration-500 ${isOverBudget ? 'bg-rose-500' : 'bg-emerald-500'}`} 
            style={{ width: `${limitPercent}%` }}
          />
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs text-slate-400">
          <div>
            <div className="flex items-center gap-1.5 text-slate-300 font-medium mb-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Time-to-Budget Alignment</span>
            </div>
            <span>Your expenses are updated in real-time. Review completed stops to ensure optimal savings.</span>
          </div>

          <div className="flex flex-col justify-end">
            <div className="flex justify-between items-center mb-1 text-slate-300">
              <span>Financial Health Status:</span>
              <span className={`font-mono font-bold uppercase ${isOverBudget ? 'text-rose-400' : 'text-emerald-400'}`}>
                {isOverBudget ? 'Critical Limit Triggered' : 'Stable & Safe'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Breakdown List */}
      <div id="category_breakdown_card" className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <h3 className="font-sans text-sm font-semibold text-slate-800 mb-5 uppercase tracking-wider">Expense Item Distribution</h3>
        <div className="space-y-5">
          {categories.map((cat, i) => {
            const ratio = cat.expected > 0 ? (cat.actual / cat.expected) : 1;
            const deviationPercent = Math.round((ratio - 1) * 100);
            
            return (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">{cat.name}</span>
                  <div className="font-mono text-slate-500 space-x-2">
                    <span>Est: {symbol}{cat.expected.toLocaleString()}</span>
                    <span>•</span>
                    <span className="font-bold text-slate-900">Act: {symbol}{cat.actual.toLocaleString()}</span>
                    {deviationPercent !== 0 && cat.expected > 0 && (
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${deviationPercent > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {deviationPercent > 0 ? `+${deviationPercent}%` : `${deviationPercent}%`}
                      </span>
                    )}
                  </div>
                </div>
                {/* Visual bar mini */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${cat.color} transition-all duration-300`} 
                    style={{ width: `${Math.min(Math.max((cat.actual / Math.max(1, expectedCost)) * 100, 2), 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
