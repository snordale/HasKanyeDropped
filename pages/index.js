import { useEffect, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { themes } from '../lib/themes';
import Layout from '../components/Layout';
import AlbumDisplay from '../components/AlbumDisplay';
import AlbumList from '../components/AlbumList';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

export default function Home() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showWaveTooltip, setShowWaveTooltip] = useState(false);
    const [theme, setTheme] = useState({ color: '', lyric: '' });
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            const response = await fetch('/api/kanye');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const jsonData = await response.json();

            if (!jsonData.kanye || !jsonData.albums || !jsonData.albums.data || !jsonData.albums.order) {
                throw new Error('Invalid data structure');
            }

            setData(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Set theme
        const keys = Object.keys(themes);
        const randomTheme = keys[Math.floor(Math.random() * keys.length)];
        setTheme({
            color: themes[randomTheme].colors[0],
            lyric: themes[randomTheme].lyrics[0]
        });

        fetchData();
    }, [fetchData]);

    const hasNewAlbum = useMemo(() => {
        if (!data?.albums?.order?.length) return false;

        const mostRecentAlbum = data.albums.data[data.albums.order[0]];
        const releaseDate = new Date(mostRecentAlbum.releaseDate);
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        return releaseDate > oneMonthAgo;
    }, [data]);

    const newAlbum = useMemo(() => {
        if (!hasNewAlbum || !data?.albums?.order?.length) return null;
        return data.albums.data[data.albums.order[0]];
    }, [hasNewAlbum, data]);

    if (loading) return <LoadingState />;
    if (error) return <ErrorState error={error} />;
    if (!data) return <Layout theme={theme}><div>No data available</div></Layout>;

    return (
        <Layout theme={theme}>
            <div className='d-flex flex-column align-items-center pt-2 pb-4 px-2 border-bottom'>
                <div className='text-center py-4'>{theme.lyric}</div>

                <AlbumDisplay
                    album={newAlbum}
                    hasNewAlbum={hasNewAlbum}
                    imageUrl={data?.kanye?.imageUrl}
                />

                <div className='h4 d-flex align-items-end text-center pt-4 my-0'>
                    {hasNewAlbum ? (
                        <>
                            <div className='d-inline'>
                                <Image
                                    src='/images/gifs/lit.gif'
                                    width={50}
                                    height={50}
                                    alt="Lit"
                                    priority
                                />
                            </div>
                            <a className="hover-link px-2" href={newAlbum.uri}>
                                {newAlbum.name} dropped on {new Date(newAlbum.releaseDate).toLocaleDateString()}
                            </a>
                            <div className='d-inline'>
                                <Image
                                    src='/images/gifs/sprinting.gif'
                                    width={50}
                                    height={50}
                                    alt="Sprinting"
                                    priority
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className='d-inline'>
                                <Image
                                    src='/images/gifs/shrug.gif'
                                    width={50}
                                    height={50}
                                    alt="Shrug"
                                    priority
                                />
                            </div>
                            <div className='px-2'>Kanye hasn't dropped in the last month.</div>
                            <div className='d-inline'>
                                <Image
                                    src='/images/gifs/blank-stare.gif'
                                    width={50}
                                    height={50}
                                    alt="Blank stare"
                                    priority
                                />
                            </div>
                        </>
                    )}
                </div>

                {!hasNewAlbum && data?.albums?.order?.length > 0 && (
                    <div className='d-inline text-center pt-4'>
                        Last drop was{' '}
                        <span style={{ color: theme.color, fontWeight: 'bold' }}>
                            {data.albums.data[data.albums.order[0]].name}
                        </span>{' '}
                        on{' '}
                        <span style={{ color: theme.color, fontWeight: 'bold' }}>
                            {new Date(data.albums.data[data.albums.order[0]].releaseDate).toLocaleDateString()}
                        </span>
                    </div>
                )}

                <div className='py-4'
                    style={{ position: 'relative', cursor: 'pointer' }}
                    onMouseEnter={() => setShowWaveTooltip(true)}
                    onMouseLeave={() => setShowWaveTooltip(false)}>
                    <div className='d-inline pb-4'>
                        🌊 Waves at&nbsp;
                        <span style={{ color: theme.color }} className='d-inline font-weight-bold'>
                            {data.kanye.popularity}%
                        </span>
                        &nbsp;🌊
                    </div>
                    {showWaveTooltip && (
                        <div className='px-4 py-3 border'
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: -65,
                                width: 260,
                                backgroundColor: 'white',
                                borderRadius: 12,
                                boxShadow: '0px 0px 12px rgb(255 255 255)'
                            }}>
                            This is the Spotify Popularity metric. Score is out of 100.
                            <a href='https://developer.spotify.com/documentation/web-api/reference/#object-artistobject'
                                className="hover-link"
                                style={{ fontSize: '14px' }}
                                target='_blank'
                                rel="noopener noreferrer"> Source</a>
                        </div>
                    )}
                </div>
            </div>

            <AlbumList albums={data.albums} />
        </Layout>
    );
} 