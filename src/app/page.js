'use client'
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const url = (page) => `https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty?page=${page}1&limit=10`;
  const item_url = (id) => `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`;

  const [data, setData] = useState(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const fetcher = (url, cb) =>
    fetch(url, {})
      .then(e => e.json())
      .then(e => {
        return cb(e)
      });

  useEffect(() => {
    if (!data)
      fetcher(url(page), async (ids) => {
        setLoading(true)
        try {
          await fetch_and_page(ids)

          setTimeout(() => {
            fetcher(url(page), async (ids) => {
              await fetch_and_page(ids)
            })
          }, 10000);
        } catch (error) {
          
        }  
      })
  }, [data]);

  const fetch_and_page = async (ids) => {
    const result = await Promise.allSettled(
        ids.map(id => item_url(id))
        .map((url) => fetcher(url, (full_data) => { return full_data }))
    );

    setData((prev_data) => [...(prev_data ?? []), result.map(e => e.value.title)])
    setPage(page => page + 1);
    setLoading(false)
  }

  return (
    <div>
      {loading ? "loading page" + page : null}
      {data?.map(e => (
        <div key={e}> {e} </div>
      )) ?? "no data present"}
    </div>
  );
}
