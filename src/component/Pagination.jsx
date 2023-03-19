import React from 'react'

const Pagination = ({totalPage, page, setPage}) => {
  let arr = new Array(5).fill(0).map((a, i) => page<=2 ? i+1 : page>=totalPage-2 ? totalPage-i : (i+page)-2);
  arr.sort((a, b) => a-b)

  return (
    <div className='paginationButoon'>
      <button disabled={page===1} onClick={() => setPage(1)}>First</button>
      <button disabled={page===1} onClick={() => setPage(page-1)}>Prev</button>
      {arr.map((num) => {
          return <button disabled={page===num} key={num} onClick={() => setPage(num)}>{num}</button>
        })}
      <button disabled={page===totalPage} onClick={() => setPage(page+1)}>Next</button>
      <button disabled={page===totalPage} onClick={() => setPage(totalPage)}>Last</button>
    </div>
  )
}

export default Pagination;