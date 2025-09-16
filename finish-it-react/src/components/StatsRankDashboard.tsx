import React from 'react';
import { UserStats, RankLevel, BreathingTechnique } from '../types';
import { DEMON_SLAYER_RANKS, calculateRank, getNextRankRequirement, getTechniqueTheme } from '../config/techniques';

interface StatsRankDashboardProps {
  userStats: UserStats;
  className?: string;
}

const StatsRankDashboard: React.FC<StatsRankDashboardProps> = ({ userStats, className = '' }) => {
  const currentRankInfo = DEMON_SLAYER_RANKS[userStats.currentRank];
  const nextRankInfo = getNextRankRequirement(userStats.currentRank);
  
  const getTotalMasteryPoints = () => {
    return Object.values(userStats.masteryByTechnique).reduce((total, stats) => total + stats.masteryPoints, 0);
  };

  const getTopTechniques = () => {
    return Object.entries(userStats.masteryByTechnique)
      .sort(([,a], [,b]) => b.masteryPoints - a.masteryPoints)
      .slice(0, 3);
  };

  const getRankProgress = () => {
    if (!nextRankInfo.nextRank) return 100;
    
    const currentPoints = getTotalMasteryPoints();
    const currentRankPoints = currentRankInfo.requiredMastery;
    const nextRankPoints = DEMON_SLAYER_RANKS[nextRankInfo.nextRank].requiredMastery;
    
    return ((currentPoints - currentRankPoints) / (nextRankPoints - currentRankPoints)) * 100;
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const renderRankBadge = (rank: RankLevel, size: 'small' | 'large' = 'large') => {
    const rankInfo = DEMON_SLAYER_RANKS[rank];
    const isCurrentRank = rank === userStats.currentRank;
    
    return (
      <div className={`
        flex flex-col items-center justify-center rounded-2xl transition-all duration-300
        ${size === 'large' ? 'w-24 h-24 p-4' : 'w-16 h-16 p-2'}
        ${isCurrentRank 
          ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg scale-110' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }
      `}>
        <div className={`font-black ${size === 'large' ? 'text-2xl' : 'text-lg'}`}>
          {rankInfo.kanji}
        </div>
        <div className={`text-xs font-semibold ${size === 'large' ? 'mt-1' : ''}`}>
          {rankInfo.name}
        </div>
      </div>
    );
  };

  const renderTechniqueStats = (technique: BreathingTechnique, stats: any, index: number) => {
    const theme = getTechniqueTheme(technique);
    const completionRate = stats.totalTime > 0 ? (stats.averageCompletion || 0) : 0;
    
    return (
      <div
        key={technique}
        className="relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-105"
        style={{
          background: theme.colors.background,
          border: `2px solid ${theme.colors.primary}30`
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div 
              className="text-2xl font-black"
              style={{ color: theme.colors.primary }}
            >
              {theme.kanji}
            </div>
            <div>
              <h3 className="font-bold text-gray-800">{theme.name}</h3>
              <div className="text-sm text-gray-600">Level {stats.rank}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black" style={{ color: theme.colors.primary }}>
              {stats.masteryPoints}
            </div>
            <div className="text-xs text-gray-600">mastery</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tasks Completed</span>
            <span className="font-semibold">{stats.completedTasks}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Focus Time</span>
            <span className="font-semibold">{formatTime(stats.totalTime)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Completion Rate</span>
            <span className="font-semibold">{Math.round(completionRate)}%</span>
          </div>
        </div>

        {/* Mastery progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Mastery Progress</span>
            <span>{Math.min(100, (stats.masteryPoints / 100) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (stats.masteryPoints / 100) * 100)}%`,
                background: theme.colors.gradient
              }}
            />
          </div>
        </div>

        {/* Rank indicator */}
        <div className="absolute top-4 right-4">
          <div className="flex space-x-1">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < Math.min(5, Math.floor(stats.masteryPoints / 20))
                    ? 'bg-yellow-400'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`stats-rank-dashboard ${className}`}>
      {/* Current Rank Section */}
      <div className="mb-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Demon Slayer Rank</h2>
          <p className="text-gray-600">Your journey through the ranks of the Demon Slayer Corps</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Current Rank</h3>
              {renderRankBadge(userStats.currentRank)}
              <div className="mt-2 text-sm text-gray-600">
                {getTotalMasteryPoints()} mastery points
              </div>
            </div>

            {nextRankInfo.nextRank && (
              <div className="flex-1 mx-8">
                <div className="text-center mb-4">
                  <h4 className="font-semibold text-gray-700">Progress to {DEMON_SLAYER_RANKS[nextRankInfo.nextRank].name}</h4>
                  <div className="text-sm text-gray-600">
                    {nextRankInfo.pointsNeeded - Math.floor(getRankProgress() * nextRankInfo.pointsNeeded / 100)} points needed
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                  <div
                    className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000"
                    style={{ width: `${getRankProgress()}%` }}
                  />
                </div>
                <div className="text-center text-sm text-gray-600">
                  {Math.round(getRankProgress())}% complete
                </div>
              </div>
            )}

            {nextRankInfo.nextRank ? (
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Next Rank</h3>
                {renderRankBadge(nextRankInfo.nextRank)}
              </div>
            ) : (
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Hashira Achieved!</h3>
                <div className="text-4xl">🏆</div>
                <div className="text-sm text-gray-600 mt-2">Maximum Rank</div>
              </div>
            )}
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            <div className="text-center p-4 bg-blue-50 rounded-2xl">
              <div className="text-3xl font-black text-blue-600">{userStats.totalTasks}</div>
              <div className="text-sm font-semibold text-blue-800">Total Tasks</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-2xl">
              <div className="text-3xl font-black text-green-600">{userStats.completedTasks}</div>
              <div className="text-sm font-semibold text-green-800">Completed</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-2xl">
              <div className="text-3xl font-black text-purple-600">{formatTime(userStats.totalFocusTime)}</div>
              <div className="text-sm font-semibold text-purple-800">Focus Time</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-2xl">
              <div className="text-3xl font-black text-yellow-600">
                {Math.round((userStats.completedTasks / Math.max(1, userStats.totalTasks)) * 100)}%
              </div>
              <div className="text-sm font-semibold text-yellow-800">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Technique Mastery Section */}
      <div className="mb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Breathing Technique Mastery</h2>
          <p className="text-gray-600">Your progress with each breathing style</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getTopTechniques().map(([technique, stats], index) => 
            renderTechniqueStats(technique as BreathingTechnique, stats, index)
          )}
        </div>
      </div>

      {/* Achievements Section */}
      {userStats.achievements.length > 0 && (
        <div>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Achievements</h2>
            <p className="text-gray-600">Milestones in your demon slayer journey</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {userStats.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="bg-white rounded-2xl p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <h3 className="font-bold text-gray-800 text-sm mb-1">{achievement.name}</h3>
                <p className="text-xs text-gray-600">{achievement.description}</p>
                <div className="text-xs text-gray-500 mt-2">
                  {achievement.unlockedAt.toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Ranks Display */}
      <div className="mt-12">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Demon Slayer Corps Ranks</h2>
          <p className="text-gray-600 text-sm">From lowest to highest rank</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {(Object.keys(DEMON_SLAYER_RANKS) as RankLevel[]).map((rank) => (
            <div key={rank} className="text-center">
              {renderRankBadge(rank, 'small')}
              <div className="text-xs text-gray-600 mt-1">
                {DEMON_SLAYER_RANKS[rank].requiredMastery} pts
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsRankDashboard;