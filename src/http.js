module.exports = {
  badRequest(response, error){
    return response.status(400).json({ error })
  },
  notFound(response, error){
    return response.status(404).json({ error })
  },
  ok(response, body){
    return response.status(200).json(body)
  },
  noContent(response){
    return response.status(204).send()
  },
  created(response, body){
    return response.status(201).send(body)
  }
}