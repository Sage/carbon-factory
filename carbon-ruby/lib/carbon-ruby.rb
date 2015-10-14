class CarbonRuby
  def self.present(klass, schema)
    json = {}

    iterate_through_schema(schema, klass, json)

    json
  end

  private

  def self.iterate_through_schema(current_schema, object, json)
    current_schema.each do |key, child_schema|
      # if the key is a definition for a collection of items:
      if is_a_collection_schema_definition?(key)
        iterate_through_collection_schema(key, object, json)
        next
      end

      # get the resource from the object
      resource = call_action(object, key)

      # if there is no more schema:
      if !child_schema
        json[key] = resource

      # if the resource is a collection of items:
      elsif is_a_collection?(resource)
        json[key] = []
        iterate_through_collection(resource, child_schema, json[key])

      # if the definition has more schema to iterate through:
      elsif is_an_object_schema_definition?(child_schema)
        json[key] = {}
        iterate_through_schema(child_schema, resource, json[key])
      end
    end
  end

  # if the current schema defines a collection of items
  def self.iterate_through_collection_schema(current_schema, resource, json)
    current_schema.each do |key, child_schema|
      collection = call_action(resource, key)
      json[key] = {}
      iterate_through_collection(collection, child_schema, json[key])
    end
  end

  # if the resource is a collection of items
  def self.iterate_through_collection(resource, schema, json)
    resource.each do |item|
      id = item.id || Random.rand(100000)
      json[id] = {}
      iterate_through_schema(schema, item, json[id])
    end
  end

  def self.call_action(resource, action)
    resource.try(action)
  end

  def self.is_an_object_schema_definition?(data)
    data.kind_of? Array
  end

  def self.is_a_collection?(data)
    data.kind_of? Array
  end

  def self.is_a_collection_schema_definition?(data)
    data.kind_of? Hash
  end
end
