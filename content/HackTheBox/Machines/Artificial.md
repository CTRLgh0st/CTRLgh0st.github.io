---
title: Artificial
tags:
  - HackTheBox
  - Easy
  - Hierarchical Data Formats
  - reverse shell
  - web-exploitation
  - Season-8
---

![](/static/images/Artificial.png)
[https://app.hackthebox.com/machines/668](https://app.hackthebox.com/machines/668)

---
- **Owned Artificial from Hack The Box!**
![](/static/images/Artificial_Pwned.png)
[https://www.hackthebox.com/achievement/machine/2202715/668](https://www.hackthebox.com/achievement/machine/2202715/668)

## **Enumeration :**

### `nmap` scan :

```bash
# Nmap 7.95 scan initiated Mon Jun 23 15:02:22 2025 as: /usr/lib/nmap/nmap --privileged -sV -sC -oN nmap_scan.txt 10.10.11.74
Nmap scan report for 10.10.11.74
Host is up (0.18s latency).
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.13 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   3072 7c:e4:8d:84:c5:de:91:3a:5a:2b:9d:34:ed:d6:99:17 (RSA)
|   256 83:46:2d:cf:73:6d:28:6f:11:d5:1d:b4:88:20:d6:7c (ECDSA)
|_  256 e3:18:2e:3b:40:61:b4:59:87:e8:4a:29:24:0f:6a:fc (ED25519)
80/tcp open  http    nginx 1.18.0 (Ubuntu)
|_http-title: Did not follow redirect to http://artificial.htb/
|_http-server-header: nginx/1.18.0 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
# Nmap done at Mon Jun 23 15:03:20 2025 -- 1 IP address (1 host up) scanned in 57.30 seconds

```

#### ⛔ This box is still active on HackTheBox. Once retired, I will add all write-up
