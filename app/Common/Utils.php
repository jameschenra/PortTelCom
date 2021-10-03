<?php namespace App\Common;

class Utils {

    public static $operators = ['eq', 'gt', 'gte', 'lt', 'lte', 'not'];

	public static function is_true($value) {
        return filter_var($value, FILTER_VALIDATE_BOOLEAN);
    }

    public static function pagination($query, $request) {
        $page = $request->input('page');
        $pageSize = $request->input('pageSize');
        $orderBy = $request->input('orderBy');

        if ($page &&  is_numeric($page) &&
            $pageSize && is_numeric($pageSize)) {
            $query = $query->offset(($page - 1) * $pageSize)->limit($pageSize);
        }

        return $query;
    }

    public static function filterAttributes($query, $request, $model, $excepts = []) {
        $attributes = $model->getFillable();
        $params = $request->except(array_merge(['page', 'pageSize', 'orderBy', 'expand'], $excepts));
        $orderBy = $request->input('orderBy');

        foreach ($params as $key => $param) {
            if (in_array($key, $attributes)) {
                $condArr = explode(':', $param, 2);
                if (count($condArr) > 1) {
                    $condition = '=';
                    $compareValue = $condArr[1];
                    switch ($condArr[0]) {
                        case 'eq':
                            $condition = '=';
                            break;
                        case 'gt':
                            $condition = '>';
                            break;
                        case 'gte':
                            $condition = '>=';
                            break;
                        case 'lt':
                            $condition = '<';
                            break;
                        case 'lte':
                            $condition = '<=';
                            break;
                        case 'not':
                            $condition = '<>';
                            break;
                        default:
                            break;
                    }

                    if ($key == 'locked' || $key == 'active') {
                        $compareValue = Utils::is_true($compareValue);
                    }
                    $query = $query->where($key, $condition, $compareValue);
                } else {
                    if ($key == 'locked' || $key == 'active') {
                        $param = Utils::is_true($param);
                    }
                    $query = $query->where($key, $param);
                }
            }
        }

        if ($orderBy && in_array($orderBy, $attributes)) {
            $query = $query->orderBy($orderBy);
        }
        
        return $query;
    }

    public static function expandAttributes($query, $expands, $model) {
        $targetModel = null;
        if(!$query) {
            $targetModel = $model->toArray();
        }

        if ($expands) {
            $expands = explode(',', $expands);
            foreach ($expands as $expand) {
                if(in_array($expand, $model->expands)) {
                    if ($query) {
                        $query = $query->with($expand);
                    } else {
                        $targetModel[$expand] = $model[$expand];
                    }
                }
            }
        }
        
        if ($query) {
            return $query;
        } else {
            return $targetModel;
        }
    }

    public static function changeUnderScroeToCamelAttr($array, $expands, $model) {
        $expands = explode(',', $expands);

        foreach ($model->expandsUnderScore as $camelAttr => $underScoreAttr) {
            if (in_array($camelAttr, $expands)) {
                foreach ($array as &$item) {
                    $item[$camelAttr] = $item[$underScoreAttr];
                    unset($item[$underScoreAttr]);
                }
            }
        }

        return $array;
    }
}