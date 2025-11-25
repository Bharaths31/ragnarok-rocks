import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { fetchData } from '../utils/firestore';
import type { NewsTopic } from '../types';

interface NewsItem {
    title: string;
    description: string;
    url: string;
    source: string;
    publishedAt: string;
    image?: string;
}

const News: React.FC = () => {
  const [topics, setTopics] = useState<NewsTopic[]>([]);
  const [news, setNews] = useState<Record<string, NewsItem[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTopics = async () => {
        const t = await fetchData<NewsTopic>('news_topics');
        setTopics(t);
        // Mock fetching news for each topic
        const mockNews: Record<string, NewsItem[]> = {};

        t.forEach(topic => {
            mockNews[topic.topic] = [
                {
                    title: `Latest breakthrough in ${topic.topic}`,
                    description: `Researchers have found a new way to improve ${topic.topic} significantly.`,
                    url: '#',
                    source: 'TechDaily',
                    publishedAt: new Date().toLocaleDateString(),
                },
                {
                    title: `Future of ${topic.topic}`,
                    description: `Experts discuss what's next for the field of ${topic.topic}.`,
                    url: '#',
                    source: 'ScienceNet',
                    publishedAt: new Date().toLocaleDateString(),
                }
            ];
        });

        setNews(mockNews);
        setLoading(false);
    };
    loadTopics();
  }, []);

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-8 shiny-text">Tech News Feed</h1>
      <p className="text-gray-400 mb-8">Curated news based on your preferred topics.</p>

      {loading ? (
          <div className="flex justify-center p-12">Loading News...</div>
      ) : topics.length === 0 ? (
          <div className="text-center text-gray-500 bg-white/5 p-12 rounded-xl">
              No news topics configured. Add some in Admin &gt; News.
          </div>
      ) : (
          <div className="flex flex-col gap-12">
              {topics.map(topic => (
                  <div key={topic.id}>
                      <h2 className="text-2xl font-bold mb-4 text-neon-blue border-b border-neon-blue/20 pb-2 inline-block pr-12">
                          {topic.topic}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {news[topic.topic]?.map((item, i) => (
                              <a
                                key={i}
                                href={item.url}
                                className="glass-panel-dark p-6 rounded-xl hover:bg-white/5 transition-all hover:scale-[1.02] cursor-pointer group"
                              >
                                <h3 className="text-xl font-bold mb-2 group-hover:text-neon-purple transition-colors">{item.title}</h3>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>
                                <div className="flex justify-between items-center text-xs text-gray-500">
                                    <span className="bg-white/10 px-2 py-1 rounded">{item.source}</span>
                                    <span>{item.publishedAt}</span>
                                </div>
                              </a>
                          ))}
                      </div>
                  </div>
              ))}
          </div>
      )}
    </Layout>
  );
};

export default News;
