import React, { useState, useEffect } from 'react';

const InternetExplorer = ({ onCommand }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [isDialing, setIsDialing] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // 模拟拨号连接过程
  useEffect(() => {
    const dialTimer = setTimeout(() => {
      setIsDialing(false);
    }, 2000);

    const loadTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);

    // 模拟加载进度
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => {
      clearTimeout(dialTimer);
      clearTimeout(loadTimer);
      clearInterval(progressInterval);
    };
  }, []);

  // 监听全局导航事件
  useEffect(() => {
    const handleNavigate = (event) => {
      if (event.detail && event.detail.page) {
        setCurrentPage(event.detail.page);
      }
    };

    window.addEventListener('ieNavigate', handleNavigate);
    return () => {
      window.removeEventListener('ieNavigate', handleNavigate);
    };
  }, []);

  const pages = {
    home: {
      title: 'Retro Mac Web 1.0',
      content: `
        <div style="background: white; padding: 20px; font-family: Geneva, Arial, sans-serif; font-size: 12px;">
          <h1 style="color: #000080; font-size: 24px; text-align: center; margin-bottom: 20px;">
            🌐 Welcome to the Internet! 🌐
          </h1>
          <p style="text-align: center; margin-bottom: 15px;">
            This site is best viewed in <b>Internet Explorer 5.0 for Macintosh</b>.
          </p>
          <marquee style="background: yellow; padding: 5px; border: 2px solid red; margin: 10px 0;">
            🔥 Surf's Up! The Web is Totally Radical! 🔥
          </marquee>
          <hr style="border: 1px solid #808080; margin: 20px 0;">
          <h2 style="color: #800080; font-size: 18px;">🎯 Hot Links:</h2>
          <ul style="margin-left: 30px;">
            <li style="margin: 8px 0;"><a href="#" onclick="return false;" style="color: blue; text-decoration: underline;">📻 Download RealPlayer (FREE!)</a></li>
            <li style="margin: 8px 0;"><a href="#" onclick="return false;" style="color: blue; text-decoration: underline;">📝 Sign our Guestbook</a></li>
            <li style="margin: 8px 0;"><a href="#" onclick="return false;" style="color: blue; text-decoration: underline;">💬 Join the Forum</a></li>
            <li style="margin: 8px 0;"><a href="#" onclick="return false;" style="color: blue; text-decoration: underline;">🎵 Download Winamp Skins</a></li>
          </ul>
          <hr style="border: 1px solid #808080; margin: 20px 0;">
          <div style="text-align: center; background: #f0f0f0; padding: 10px; border: 1px solid #ccc;">
            <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wjRLEuQRNnGt7QpVdNhHJBkaIRdOZWnfXgqxXXlkJc2SVC8KbxAlVunNmAAAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wjRLEuQRNnGt7QpVdNhHJBkaIRdOZWnfXgqxXXlkJc2SVC8KbxAlVunNmAAAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAA7" alt="Loading..." style="width: 16px; height: 16px;">
            <span style="margin-left: 10px; font-size: 10px;">Last updated: March 15, 1999</span>
          </div>
          <div style="text-align: center; margin-top: 15px; font-size: 10px; color: #666;">
            <p>Visitor Counter: 000042 | Best viewed at 800x600</p>
            <p>© 1999 Retro Mac Web. All rights reserved.</p>
          </div>
        </div>
      `
    },
    construction: {
      title: 'Under Construction',
      content: `
        <div style="background: #ffff00; padding: 30px; text-align: center; font-family: Geneva, Arial, sans-serif;">
          <h1 style="color: red; font-size: 36px; text-shadow: 2px 2px 4px #000; animation: blink 1s infinite;">
            🚧 UNDER CONSTRUCTION 🚧
          </h1>
          <div style="margin: 30px 0;">
            <img src="data:image/gif;base64,R0lGODlhPAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAPAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAPAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAADwAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAADwAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAADwAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAPAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAPAAQAAADMgi63P7wjRLEuQRNnGt7QpVdNhHJBkaIRdOZWnfXgqxXXlkJc2SVC8KbxAlVunNmAAAh+QQJCgAAACwAAAAAPAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAPAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAADwAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAADwAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAADwAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAPAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAPAAQAAADMgi63P7wjRLEuQRNnGt7QpVdNhHJBkaIRdOZWnfXgqxXXlkJc2SVC8KbxAlVunNmAAA7" alt="Construction" style="width: 60px; height: 16px;">
          </div>
          <marquee style="background: red; color: white; padding: 10px; font-weight: bold; font-size: 18px;">
            🔨 This page is being hammered into shape! Come back soon! 🔨
          </marquee>
          <div style="margin: 20px 0; font-size: 14px;">
            <p>🎵 <em>Now playing: construction_site.mid</em> 🎵</p>
            <p style="margin-top: 15px;">👷‍♂️ Webmaster: Bob the Builder</p>
            <p>📧 Email: bob@geocities.com/~construction99</p>
          </div>
          <div style="position: absolute; bottom: 10px; right: 10px; font-size: 10px;">
            <span style="animation: bounce 2s infinite;">🌟</span>
          </div>
        </div>
        <style>
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
          }
        </style>
      `
    },
    hacker: {
      title: 'H4CK3R Z0N3',
      content: `
        <div style="background: #000; color: #00ff00; padding: 20px; font-family: 'Courier New', monospace; font-size: 12px; min-height: 400px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #ff0000; font-size: 24px; text-shadow: 0 0 10px #ff0000;">
              ☠️ UNAUTHORIZED ACCESS DETECTED ☠️
            </h1>
          </div>
          <div style="margin: 20px 0;">
            <p style="margin: 5px 0;">root@geocities:~$ whoami</p>
            <p style="margin: 5px 0;">elite_hacker_1999</p>
            <p style="margin: 5px 0;">root@geocities:~$ ls -la /secret</p>
            <p style="margin: 5px 0;">drwxr-xr-x 2 root root 4096 Mar 15 23:59 .</p>
            <p style="margin: 5px 0;">drwxr-xr-x 3 root root 4096 Mar 15 23:58 ..</p>
            <p style="margin: 5px 0;">-rw------- 1 root root  666 Mar 15 23:59 nuclear_codes.txt</p>
            <p style="margin: 5px 0;">-rw------- 1 root root 1337 Mar 15 23:59 area51_files.zip</p>
          </div>
          <div style="border: 1px solid #00ff00; padding: 15px; margin: 20px 0; background: #001100;">
            <h3 style="color: #ffff00; margin-bottom: 10px;">⚠️ WARNING ⚠️</h3>
            <p>You have accessed a restricted area of cyberspace.</p>
            <p>Your IP address has been logged: 192.168.1.42</p>
            <p>The FBI has been notified.</p>
            <p style="margin-top: 10px;">Just kidding! This is just a GeoCities page from 1999 😄</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" onclick="alert('You have been warned.'); return false;" 
               style="color: #ff0000; text-decoration: none; font-weight: bold; font-size: 16px; 
                      text-shadow: 0 0 5px #ff0000; animation: glow 2s infinite alternate;">
              🔥 CLICK HERE TO HACK THE PENTAGON 🔥
            </a>
          </div>
          <div style="position: absolute; bottom: 20px; left: 20px; font-size: 10px;">
            <p>Powered by: 1337 H4X0R T00LZ v2.0</p>
            <p>© 1999 Underground Web Ring</p>
          </div>
        </div>
        <style>
          @keyframes glow {
            from { text-shadow: 0 0 5px #ff0000; }
            to { text-shadow: 0 0 20px #ff0000, 0 0 30px #ff0000; }
          }
        </style>
      `
    },
    search: {
      title: 'RetroSearch Engine',
      content: `
        <div style="background: white; padding: 20px; font-family: Geneva, Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #800080; font-size: 28px; margin-bottom: 10px;">🔍 RetroSearch! 🔍</h1>
            <p style="font-size: 12px; color: #666;">The Web's Most Comprehensive Search Directory!</p>
          </div>
          <div style="text-align: center; margin: 30px 0; background: #f0f0f0; padding: 20px; border: 2px solid #ccc;">
            <input type="text" value="cat gif" readonly 
                   style="width: 300px; padding: 5px; font-size: 14px; border: 2px inset #ccc;">
            <br><br>
            <button style="padding: 8px 20px; font-size: 12px; background: #c0c0c0; border: 2px outset #ccc; cursor: pointer;"
                    onclick="document.getElementById('searchResults').style.display='block'">
              🔍 Search the Web!
            </button>
          </div>
          <div id="searchResults" style="display: none; margin-top: 30px;">
            <h3 style="color: #000080;">Search Results (1-3 of about 47 results)</h3>
            <hr style="border: 1px solid #ccc;">
            <div style="margin: 15px 0; padding: 10px; background: #ffffcc; border: 1px solid #ffcc00;">
              <h4 style="color: blue; margin: 0;">🐱 Amazing Cat GIFs - GeoCities</h4>
              <p style="font-size: 11px; color: #008000; margin: 5px 0;">www.geocities.com/pets/cats/gifs</p>
              <p style="font-size: 12px; margin: 5px 0;">The BEST collection of animated cat GIFs on the World Wide Web! Over 200 dancing cats, spinning cats, and rainbow cats!</p>
              <div style="text-align: center; margin: 15px 0;">
                <img src="data:image/gif;base64,R0lGODlhPAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAPAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAPAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAADwAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAADwAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAADwAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAPAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAPAAQAAADMgi63P7wjRLEuQRNnGt7QpVdNhHJBkaIRdOZWnfXgqxXXlkJc2SVC8KbxAlVunNmAAA7" 
                     alt="Dancing Cat" style="width: 60px; height: 16px; border: 1px solid #000;">
                <p style="font-size: 10px; margin-top: 5px;">🐾 Authentic 1999 Cat GIF! 🐾</p>
              </div>
            </div>
            <div style="margin: 15px 0;">
              <h4 style="color: blue; margin: 0;">Cat Pictures - Angelfire</h4>
              <p style="font-size: 11px; color: #008000; margin: 5px 0;">www.angelfire.com/ca/cats/index.html</p>
              <p style="font-size: 12px; margin: 5px 0;">My personal collection of cat photos. Updated weekly! Please sign my guestbook!</p>
            </div>
            <div style="margin: 15px 0;">
              <h4 style="color: blue; margin: 0;">Feline Friends WebRing</h4>
              <p style="font-size: 11px; color: #008000; margin: 5px 0;">www.webring.org/cats</p>
              <p style="font-size: 12px; margin: 5px 0;">Join the ultimate cat lovers' web ring! 47 sites and growing!</p>
            </div>
          </div>
          <div style="text-align: center; margin-top: 30px; font-size: 10px; color: #666;">
            <p>Powered by RetroSearch Technology™</p>
            <p>© 1999 RetroSearch Inc. All rights reserved.</p>
          </div>
        </div>
      `
    },
    easteregg: {
      title: '🌌 CYBERSPACE PORTAL 🌌',
      content: `
        <div style="background: linear-gradient(45deg, #000033, #000066, #003366, #000033); 
                    color: white; padding: 20px; font-family: 'Courier New', monospace; 
                    min-height: 400px; position: relative; overflow: hidden;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-size: 32px; color: #00ffff; text-shadow: 0 0 20px #00ffff; 
                       animation: pulse 2s infinite;">
              ✨ WELCOME TO CYBERSPACE ✨
            </h1>
            <p style="font-size: 14px; color: #ffff00; animation: glow 3s infinite alternate;">
              You have discovered the secret dimension of the Internet!
            </p>
          </div>
          
          <div style="text-align: center; margin: 40px 0;">
            <div style="display: inline-block; padding: 20px; border: 2px solid #00ffff; 
                        background: rgba(0,255,255,0.1); border-radius: 10px;">
              <h2 style="color: #ff00ff; font-size: 24px; margin-bottom: 15px; 
                         animation: rainbow 4s infinite;">
                🎵 DIGITAL SYMPHONY 🎵
              </h2>
              <div style="width: 300px; height: 100px; background: #000; border: 2px solid #00ff00; 
                          position: relative; margin: 0 auto;">
                <div style="position: absolute; width: 100%; height: 100%; 
                            background: repeating-linear-gradient(90deg, 
                            transparent, transparent 10px, #00ff00 10px, #00ff00 12px); 
                            animation: visualizer 1s infinite;">
                </div>
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                            color: #00ffff; font-size: 12px;">
                  🎶 WINAMP VISUALIZATION MODE 🎶
                </div>
              </div>
            </div>
          </div>
          
          <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
                      pointer-events: none; z-index: -1;">
            <div style="position: absolute; top: 20%; left: 10%; width: 4px; height: 4px; 
                        background: white; border-radius: 50%; animation: twinkle 3s infinite;"></div>
            <div style="position: absolute; top: 60%; left: 80%; width: 3px; height: 3px; 
                        background: #ffff00; border-radius: 50%; animation: twinkle 2s infinite 0.5s;"></div>
            <div style="position: absolute; top: 30%; left: 70%; width: 2px; height: 2px; 
                        background: #ff00ff; border-radius: 50%; animation: twinkle 4s infinite 1s;"></div>
            <div style="position: absolute; top: 80%; left: 20%; width: 3px; height: 3px; 
                        background: #00ffff; border-radius: 50%; animation: twinkle 2.5s infinite 1.5s;"></div>
          </div>
          
          <div style="text-align: center; margin-top: 50px;">
            <p style="font-size: 16px; color: #00ff00; animation: typewriter 4s infinite;">
              > ACCESSING MAINFRAME...
            </p>
            <p style="font-size: 12px; color: #ffffff; margin-top: 20px;">
              🚀 You are now browsing in MAXIMUM OVERDRIVE mode! 🚀
            </p>
          </div>
        </div>
        
        <style>
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          @keyframes glow {
            from { text-shadow: 0 0 5px #ffff00; }
            to { text-shadow: 0 0 20px #ffff00, 0 0 30px #ffff00; }
          }
          @keyframes rainbow {
            0% { color: #ff0000; }
            16% { color: #ff8000; }
            33% { color: #ffff00; }
            50% { color: #00ff00; }
            66% { color: #0080ff; }
            83% { color: #8000ff; }
            100% { color: #ff0000; }
          }
          @keyframes visualizer {
            0% { opacity: 0.3; }
            50% { opacity: 1; }
            100% { opacity: 0.3; }
          }
          @keyframes twinkle {
            0%, 100% { opacity: 0; }
            50% { opacity: 1; }
          }
          @keyframes typewriter {
            0% { width: 0; }
            50% { width: 100%; }
            100% { width: 0; }
          }
        </style>
      `
    },
    crash: {
      title: 'Internet Explorer Error',
      content: `
        <div style="background: #c0c0c0; padding: 0; font-family: 'MS Sans Serif', sans-serif; font-size: 11px;">
          <div style="background: linear-gradient(to bottom, #0080ff, #004080); color: white; 
                      padding: 2px 8px; font-weight: bold; font-size: 11px;">
            Internet Explorer
          </div>
          <div style="padding: 20px; text-align: center;">
            <div style="margin-bottom: 20px;">
              <span style="font-size: 32px;">❌</span>
            </div>
            <h3 style="margin: 10px 0; font-size: 12px;">Internet Explorer has encountered an error and needs to close.</h3>
            <p style="margin: 15px 0; font-size: 11px;">We are sorry for the inconvenience.</p>
            
            <div style="background: white; border: 1px inset #c0c0c0; padding: 10px; margin: 20px 0; text-align: left;">
              <p style="font-size: 10px; margin: 5px 0;"><strong>Error Details:</strong></p>
              <p style="font-size: 10px; margin: 5px 0;">Application: iexplore.exe</p>
              <p style="font-size: 10px; margin: 5px 0;">Exception: 0xC0000005 (Access Violation)</p>
              <p style="font-size: 10px; margin: 5px 0;">Address: 0x77F5D2C3</p>
              <p style="font-size: 10px; margin: 5px 0;">Module: ntdll.dll</p>
            </div>
            
            <div style="margin: 20px 0;">
              <button style="padding: 4px 12px; margin: 0 5px; font-size: 11px; 
                             background: #c0c0c0; border: 1px outset #c0c0c0; cursor: pointer;"
                      onclick="alert('Error report sent to Microsoft!')">
                Send Error Report
              </button>
              <button style="padding: 4px 12px; margin: 0 5px; font-size: 11px; 
                             background: #c0c0c0; border: 1px outset #c0c0c0; cursor: pointer;"
                      onclick="alert('Internet Explorer will now restart...')">
                Restart
              </button>
            </div>
            
            <div style="margin-top: 30px; font-size: 10px; color: #666;">
              <p>This error is totally authentic to the 1999 Internet experience! 😄</p>
              <p>No actual browsers were harmed in the making of this simulation.</p>
            </div>
          </div>
        </div>
      `
    }
  };

  const navigateToPage = (pageId) => {
    setCurrentPage(pageId);
  };

  if (isLoading) {
    return (
      <div className="h-full bg-gray-200 flex flex-col">
        {/* IE5 Mac 标题栏 */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-3 py-1 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span>🌐</span>
            <span>Internet Explorer</span>
          </div>
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-yellow-400 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
            <div className="w-3 h-3 bg-red-400 rounded-sm"></div>
          </div>
        </div>

        {/* 加载界面 */}
        <div className="flex-1 flex flex-col items-center justify-center bg-white">
          {isDialing ? (
            <div className="text-center">
              <div className="text-4xl mb-4">📞</div>
              <div className="text-lg font-mono mb-2">拨号中...</div>
              <div className="text-sm text-gray-600">正在连接到 Internet 服务提供商</div>
              <div className="mt-4 w-64 h-2 bg-gray-300 rounded">
                <div className="h-full bg-blue-500 rounded animate-pulse" style={{ width: '30%' }}></div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-4xl mb-4">🌐</div>
              <div className="text-lg font-mono mb-2">正在加载网页...</div>
              <div className="text-sm text-gray-600">Internet Explorer 5.0 for Macintosh</div>
              <div className="mt-4 w-64 h-2 bg-gray-300 rounded">
                <div 
                  className="h-full bg-green-500 rounded transition-all duration-300" 
                  style={{ width: `${Math.min(loadingProgress, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-2">{Math.round(loadingProgress)}%</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-200 flex flex-col" style={{ fontFamily: 'Geneva, Monaco, Arial, sans-serif' }}>
      {/* IE5 Mac 标题栏 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-3 py-1 text-xs font-bold flex items-center">
        <div className="flex items-center space-x-2">
          <span>🌐</span>
          <span>Internet Explorer - [{pages[currentPage].title}]</span>
        </div>
      </div>

      {/* 地址栏 */}
      <div className="bg-gray-300 border-b border-gray-400 px-2 py-1 flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          <span className="text-xs font-bold">地址:</span>
          <input 
            type="text" 
            value="http://www.retro-mac.net" 
            readOnly 
            className="flex-1 px-2 py-1 text-xs border border-gray-400 bg-white" 
            style={{ minWidth: '300px' }}
          />
        </div>
        <button 
          className="px-3 py-1 text-xs bg-gray-200 border border-gray-400 hover:bg-gray-100"
          onClick={() => navigateToPage('home')}
        >
          转到
        </button>
      </div>

      {/* 主体区域 - 左侧工具栏 + 内容区域 */}
      <div className="flex-1 flex">
        {/* 左侧垂直工具栏 */}
        <div className="w-16 bg-gray-300 border-r border-gray-400 flex flex-col items-center py-2 space-y-2">
          {/* IE Logo */}
          <div className="text-lg mb-2">🌐</div>
          
          {/* 导航按钮 */}
          <button 
            className="w-12 h-8 text-xs bg-gray-200 border border-gray-400 hover:bg-gray-100 flex items-center justify-center"
            onClick={() => navigateToPage('home')}
            title="后退"
          >
            ⬅️
          </button>
          <button 
            className="w-12 h-8 text-xs bg-gray-200 border border-gray-400 hover:bg-gray-100 flex items-center justify-center"
            onClick={() => navigateToPage('search')}
            title="前进"
          >
            ➡️
          </button>
          <button 
            className="w-12 h-8 text-xs bg-gray-200 border border-gray-400 hover:bg-gray-100 flex items-center justify-center"
            onClick={() => setIsLoading(true)}
            title="停止"
          >
            ⏹️
          </button>
          <button 
            className="w-12 h-8 text-xs bg-gray-200 border border-gray-400 hover:bg-gray-100 flex items-center justify-center"
            onClick={() => window.location.reload()}
            title="刷新"
          >
            🔄
          </button>
          
          <div className="border-t border-gray-400 w-10 my-2"></div>
          
          {/* 快捷导航按钮 */}
          <button 
            className="w-12 h-8 text-xs bg-gray-200 border border-gray-400 hover:bg-gray-100 flex items-center justify-center"
            onClick={() => navigateToPage('home')}
            title="首页"
          >
            🏠
          </button>
          <button 
            className="w-12 h-8 text-xs bg-gray-200 border border-gray-400 hover:bg-gray-100 flex items-center justify-center"
            onClick={() => navigateToPage('construction')}
            title="建设中"
          >
            🚧
          </button>
          <button 
            className="w-12 h-8 text-xs bg-gray-200 border border-gray-400 hover:bg-gray-100 flex items-center justify-center"
            onClick={() => navigateToPage('hacker')}
            title="黑客区"
          >
            💀
          </button>
          <button 
            className="w-12 h-8 text-xs bg-gray-200 border border-gray-400 hover:bg-gray-100 flex items-center justify-center"
            onClick={() => navigateToPage('search')}
            title="搜索"
          >
            🔍
          </button>
          <button 
            className="w-12 h-8 text-xs bg-gray-200 border border-gray-400 hover:bg-gray-100 flex items-center justify-center"
            onClick={() => navigateToPage('crash')}
            title="错误"
          >
            💥
          </button>
        </div>
        
        {/* 右侧内容区域 */}
        <div className="flex-1 flex flex-col">
          {/* 页面标题栏 */}
          <div className="bg-gray-100 border-b border-gray-300 px-3 py-1 text-xs font-bold">
            {pages[currentPage].title}
          </div>
          
          {/* 网页内容区域 */}
          <div className="flex-1 overflow-auto bg-white">
            <div 
              dangerouslySetInnerHTML={{ __html: pages[currentPage].content }}
              className="min-h-full p-4"
              style={{ cursor: 'default' }}
            />
          </div>
        </div>
      </div>

      {/* 状态栏 */}
      <div className="bg-gray-300 border-t border-gray-400 px-2 py-1 text-xs flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span>✅ 完成</span>
          <span>🔒 安全连接</span>
          <span>📡 56k 调制解调器</span>
        </div>
        <div className="text-right">
          <span>Internet Explorer 5.0 for Mac</span>
        </div>
      </div>
    </div>
  );
};

export default InternetExplorer;