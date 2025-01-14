import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { themes } from '../lib/themes';
import Header from '../components/Header';
import AlbumDisplay from '../components/AlbumDisplay';
import AlbumList from '../components/AlbumList';

export default function Home() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showWaveTooltip, setShowWaveTooltip] = useState(false);
    const [theme, setTheme] = useState({ color: '', lyric: '' });
    const [error, setError] = useState(null);

    useEffect(() => {
        // Set theme
        const keys = Object.keys(themes);
        const randomTheme = keys[Math.floor(Math.random() * keys.length)];
        setTheme({
            color: themes[randomTheme].colors[0],
            lyric: themes[randomTheme].lyrics[0]
        });

        // Fetch data
        async function fetchData() {
            try {
                const response = await fetch('/api/kanye');
                const jsonData = await response.json();

                if (!jsonData.kanye || !jsonData.albums || !jsonData.albums.data || !jsonData.albums.order) {
                    throw new Error('Invalid data structure');
                }

                setData(jsonData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
                setError(error.message);
            }
        }

        fetchData();
    }, []);

    if (loading) return <div style={{ fontFamily: 'VCR, sans-serif' }}>Loading...</div>;
    if (error) return <div style={{ fontFamily: 'VCR, sans-serif' }}>Error: {error}</div>;
    if (!data) return <div style={{ fontFamily: 'VCR, sans-serif' }}>No data</div>;

    const daysSinceRelease = Math.trunc(
        (new Date() - new Date(data.albums.data['JESUS IS KING'].releaseDate)) / (1000 * 60 * 60 * 24)
    );

    const hasNewAlbum = data.albums.order.length !== 12;
    const newAlbum = hasNewAlbum ? data.albums.data[data.albums.order[0]] : null;

    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width" />
                <link rel="apple-touch-icon" sizes="180x180" href="favicons/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="favicons/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="favicons/favicon-16x16.png" />
                <link rel="manifest" href="favicons/site.webmanifest" />
                <meta name="msapplication-TileColor" content="#da532c" />
                <meta name="theme-color" content="#ffffff" />
                <link
                    rel="stylesheet"
                    href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
                    integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
                    crossOrigin="anonymous"
                />
                <title>Has Kanye Dropped?</title>
                <style>{`
          @font-face {
            font-family: VCR;
            src: url(/fonts/FugazOne-Regular.ttf);
          }
          .hover-link {
            color: black;
            cursor: pointer;
          }
          .hover-link:hover {
            color: black;
            opacity: 0.5;
          }
        `}</style>
            </Head>

            <div className='flex-container px-4' style={{ fontFamily: 'VCR, sans-serif' }}>
                <Header theme={theme} />

                <div className='d-flex flex-column align-items-center pt-2 pb-4 px-2 border-bottom'>
                    <div className='text-center py-4'>{theme.lyric}</div>

                    <AlbumDisplay
                        album={newAlbum}
                        hasNewAlbum={hasNewAlbum}
                        imageUrl={data.kanye.imageUrl}
                    />

                    <div className='h4 d-flex align-items-end text-center pt-4 my-0'>
                        {hasNewAlbum ? (
                            <>
                                <div className='d-inline'>
                                    <Image src='/images/gifs/lit.gif' width={50} height={50} alt="Lit" />
                                </div>
                                <a className="hover-link px-2" href={newAlbum.uri}>
                                    {newAlbum.name} dropped on {new Date(newAlbum.releaseDate).toLocaleDateString()}
                                </a>
                                <div className='d-inline'>
                                    <Image src='/images/gifs/sprinting.gif' width={50} height={50} alt="Sprinting" />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className='d-inline'>
                                    <Image src='/images/gifs/shrug.gif' width={50} height={50} alt="Shrug" />
                                </div>
                                <div className='px-2'>Kanye hasn't dropped yet.</div>
                                <div className='d-inline'>
                                    <Image src='/images/gifs/blank-stare.gif' width={50} height={50} alt="Blank stare" />
                                </div>
                            </>
                        )}
                    </div>

                    {!hasNewAlbum && (
                        <div className='d-inline text-center pt-4'>
                            It's been <span style={{ color: theme.color, fontWeight: 'bold' }}>{daysSinceRelease}</span> days since Kanye dropped JESUS IS KING.
                        </div>
                    )}

                    <div className='py-4'
                        style={{ position: 'relative', cursor: 'pointer' }}
                        onMouseEnter={() => setShowWaveTooltip(true)}
                        onMouseLeave={() => setShowWaveTooltip(false)}>
                        <div className='d-inline pb-4'>
                            🌊 Waves at
                            <span style={{ color: theme.color }} className='d-inline font-weight-bold'>
                                {data.kanye.popularity}%.
                            </span>
                            🌊
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

                <div className='fluid-container d-flex justify-content-center pb-4'>
                    <a className='d-flex align-items-center hover-link' href='https://theivyplatform.com'>
                        <div className='bold'>An Ivy Joint</div>
                        <Image
                            src='/images/ivy_logo.png'
                            width={18}
                            height={18}
                            alt="Ivy Logo"
                            className='ml-2'
                        />
                    </a>
                </div>
            </div>
        </>
    );
} 